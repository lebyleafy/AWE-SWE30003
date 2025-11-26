import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  // Only allow admin
  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              // Calculate total dynamically
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{`ORD-${order.id}`}</td>
                  <td className="p-3">{order.user.name || order.user.email}</td>
                  <td className="p-3">${total.toFixed(2)}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    {order.createdAt.toISOString().split("T")[0]}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <form
                      action={async () => {
                        "use server";
                        await prisma.orderItem.deleteMany({
                          where: { orderId: order.id },
                        });
                        await prisma.order.delete({ where: { id: order.id } });
                        redirect("/admin/orders");
                      }}
                    >
                      <button
                        type="submit"
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

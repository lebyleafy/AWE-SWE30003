import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/signin");

  const userId = Number(session.user.id);

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders.length === 0 && (
        <div className="text-center text-gray-500">
          You have no orders yet.
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow p-6 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">
                Order #{order.id}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium mt-1">
                Status:{" "}
                <span className="text-blue-600">{order.status}</span>
              </p>
              <p className="font-bold mt-2">
                Total: ${order.total.toFixed(2)}
              </p>
            </div>

            <Link
              href={`/orders/${order.id}`}
              className="text-blue-600 font-medium hover:underline"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

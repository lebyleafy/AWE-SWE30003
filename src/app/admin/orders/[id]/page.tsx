import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  // Only allow admin
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const { id } = await params;
  const orderId = Number(id);
  if (isNaN(orderId)) redirect("/admin/orders");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, items: { include: { product: true } } },
  });

  // Early return ensures TypeScript knows order is not null below
  if (!order) {
    redirect("/admin/orders");
    return null;
  }

  const user = order.user;

  // Server action to update order
  async function updateOrder(formData: FormData) {
    "use server";

    // Make sure order is defined
    if (!order) return;

    const status = formData.get("status") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    // Update user info
    await prisma.user.update({
      where: { id: order.userId },
      data: { name, email },
    });

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });

    // Update item quantities
    for (const item of order.items) {
      const qtyStr = formData.get(`quantity-${item.id}`) as string;
      const quantity = Number(qtyStr);
      if (!isNaN(quantity) && quantity > 0) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { quantity },
        });
      }
    }

    // Revalidate current order page so status updates immediately
    revalidatePath(`/admin/orders/${order.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Order</h1>

        <form action={updateOrder} className="space-y-6">
          {/* Customer info & order status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.name || ""}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Customer Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Status
              </label>
              <select
                name="status"
                defaultValue={order.status}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <p className="text-gray-600 mt-6 md:mt-0">
                <span className="font-semibold">Order Date:</span>{" "}
                {order.createdAt.toISOString().split("T")[0]}
              </p>
            </div>
          </div>

          {/* Items section */}
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Items</h2>
          <ul className="divide-y divide-gray-200 mb-6">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-4 md:py-3"
              >
                {/* Left: Product info */}
                <div className="flex flex-col">
                  <p className="font-medium text-gray-700">{item.product.name}</p>
                  <p className="text-gray-500 text-sm">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Right: Quantity + total */}
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-semibold">Qty:</label>
                  <input
                    type="number"
                    name={`quantity-${item.id}`}
                    defaultValue={item.quantity}
                    min={1}
                    className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

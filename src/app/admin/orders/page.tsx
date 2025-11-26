import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  // Only allow admin
  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  // Mock orders — replace with DB later
  const orders = [
    {
      id: "ORD-1001",
      customer: "John Doe",
      total: 248,
      status: "Processing",
      date: "2025-01-12"
    },
    {
      id: "ORD-1002",
      customer: "Sarah Lee",
      total: 99,
      status: "Shipped",
      date: "2025-01-14"
    },
  ];

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
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">${order.total}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">
                  <a
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

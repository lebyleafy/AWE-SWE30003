export default function AdminDashboard() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-blue-700">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">128</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">356</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">$12,340</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "ORD-001", customer: "John Doe", total: "$499", status: "Delivered" },
              { id: "ORD-002", customer: "Jane Smith", total: "$899", status: "Processing" },
              { id: "ORD-003", customer: "Alex Johnson", total: "$1299", status: "Cancelled" },
            ].map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td className="font-medium">
                  <span
                    className={
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Processing"
                        ? "text-blue-600"
                        : "text-red-600"
                    }
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

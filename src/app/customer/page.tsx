import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function CustomerDashboard() {
  // Must await session INSIDE the component
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin"); // must return or redirect
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Welcome back, {user?.name || user?.email} 👋
        </h1>
        <p className="text-gray-600 mb-10">Here’s your account overview.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard title="My Orders" link="/orders" icon="📦" />
          <DashboardCard title="My Cart" link="/cart" icon="🛒" />
          <DashboardCard title="Account Settings" link="/settings" icon="⚙️" />
          <DashboardCard title="Support" link="/support" icon="💬" />
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              No orders found. Start shopping to see them here!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* Component must be defined OUTSIDE default export */
function DashboardCard({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: string;
}) {
  return (
    <a
      href={link}
      className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition block text-center"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </a>
  );
}

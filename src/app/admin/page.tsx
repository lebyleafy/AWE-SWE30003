import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Double-check in server component (extra safety)
  if (!session || (session.user as any).role !== "admin") {
    redirect("/"); 
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        {/* Top Header */}
        <h1 className="text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || user?.email}
        </p>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          <AdminCard
            title="Manage Products"
            description="Add, edit, delete products"
            link="/admin/products"
            icon="🛍️"
          />

          <AdminCard
            title="Manage Orders"
            description="View and update customer orders"
            link="/admin/orders"
            icon="📦"
          />

          <AdminCard
            title="Manage Users"
            description="View users and roles"
            link="/admin/users"
            icon="👤"
          />

        </div>

        {/* Stats section */}
        <div className="bg-white rounded-xl shadow p-8 mt-12">
          <h2 className="text-2xl font-semibold mb-4">Store Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Products" value="—" />
            <StatCard label="Total Orders" value="—" />
            <StatCard label="Registered Users" value="—" />
          </div>
        </div>

      </div>
    </div>
  );
}

function AdminCard({
  title,
  description,
  link,
  icon,
}: {
  title: string;
  description: string;
  link: string;
  icon: string;
}) {
  return (
    <a
      href={link}
      className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition block"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </a>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl text-center border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

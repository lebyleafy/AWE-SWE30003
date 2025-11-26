import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

interface AdminCardProps {
  title: string;
  description: string;
  link: string;
  icon: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  // Store Overview Counts with safe fallback
  const totalProducts = (await prisma.product?.count()) ?? 0;
  const totalOrders = (await prisma.order?.count()) ?? 0;
  const totalUsers = (await prisma.user?.count()) ?? 0;

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name || user?.email}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <AdminCard
            title="Manage Products"
            description="Add, edit, delete products"
            link="/products"
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

        <div className="bg-white rounded-xl shadow p-8 mt-12">
          <h2 className="text-2xl font-semibold mb-4">Store Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Products" value={totalProducts} />
            <StatCard label="Total Orders" value={totalOrders} />
            <StatCard label="Registered Users" value={totalUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCard({ title, description, link, icon }: AdminCardProps) {
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

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl text-center border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/products/DeleteButton";

export default async function ProductsPage() {
  const [products, session] = await Promise.all([
    prisma.product.findMany(),
    getServerSession(authOptions),
  ]);

  const isAdmin = !!session && (session.user as any).role === "admin";

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">All Products 🛍️</h1>
        {isAdmin && (
          <Link
            href="/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </Link>
        )}
      </div>

      <p className="text-gray-700 max-w-2xl mx-auto mb-10 text-center">
        Browse all high-quality electronics available in our store.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <Link href={`/products/${product.id}`} className="block mb-2">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
            </Link>

            {product.description && (
              <p className="text-gray-600 mb-2">{product.description}</p>
            )}

            <div className="mt-auto flex items-center justify-between">
              <p className="font-bold">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>

            {isAdmin && (
              <div className="mt-3 flex gap-3">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>

                <DeleteButton id={product.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

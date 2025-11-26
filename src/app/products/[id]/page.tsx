// src/app/products/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // ← Important: Promise!
}) {
  // Await the params first — this is the new required pattern
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return notFound();
  }

  // Fetch product and session in parallel
  const [product, session] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
    }),
    getServerSession(authOptions),
  ]);

  if (!product) {
    return notFound();
  }

  const isAdmin = !!session && (session.user as any)?.role === "admin";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {isAdmin && (
          <div className="ml-auto flex gap-4">
            <Link
              href={`/products/${product.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>

            <form
              action={`/api/products/${product.id}`}
              method="POST"
              className="inline"
            >
              <input type="hidden" name="_method" value="DELETE" />
              <button
                type="submit"
                className="text-red-600 hover:underline"
                onClick={(e) => {
                  if (!confirm("Are you sure you want to delete this product?")) {
                    e.preventDefault();
                  }
                }}
              >
                Delete
              </button>
            </form>
          </div>
        )}
      </div>

      <img
        src={product.imageUrl || "/placeholder.jpg"}
        alt={product.name}
        className="w-full max-h-96 object-cover rounded-lg mb-6"
      />

      {product.description && (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {product.description}
        </p>
      )}

      <p className="text-2xl font-semibold mb-4">
        ${Number(product.price).toFixed(2)}
      </p>

      {product.category && (
        <p className="text-sm text-gray-500">Category: {product.category}</p>
      )}
    </div>
  );
}
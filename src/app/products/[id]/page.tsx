// src/app/products/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

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
        </div>

        {/* PRODUCT INFO */}
        <div className="space-y-6">

          {/* Category */}
          <p className="text-blue-600 font-medium uppercase tracking-wide">
            {product.category}
          </p>

          {/* Name */}
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-semibold text-gray-800">
            ${product.price.toFixed(2)}
          </p>

          {/* Stock */}
          <div>
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description || "No product description available."}
          </p>

          {/* Add to Cart Button (UI only for now) */}
          <button
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition mt-4 shadow"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-12" />

      {/* Additional Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
        <p className="text-gray-600 leading-relaxed">
          {product.description ||
            "This product is part of AWE Electronics premium catalog. More details will be available soon."}
        </p>
      </section>
    </main>
  );
}
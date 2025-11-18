import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* PRODUCT IMAGE */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md h-[400px] md:h-[500px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain rounded-xl bg-gray-100"
            />
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

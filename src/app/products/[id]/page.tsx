import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartSection from "@/app/products/[id]/AddToCartSection"; // IMPORT CLIENT COMPONENT

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
          <p className="text-blue-600 font-medium uppercase tracking-wide">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold text-gray-800">
            ${product.price.toFixed(2)}
          </p>

          <div>
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "No product description available."}
          </p>

          {/* CLIENT COMPONENT FOR ADD TO CART + BUY NOW */}
          <AddToCartSection productId={product.id} />
        </div>
      </div>

      <hr className="my-12" />

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
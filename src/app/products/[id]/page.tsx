import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using await (official Next.js requirement)
  const { id } = await params;

  const productId = Number(id);
  if (Number.isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-[420px] object-cover rounded-xl shadow"
        />

        <div>
          <h1 className="text-4xl font-bold mb-4 text-blue-600">{product.name}</h1>
          <p className="text-gray-500 mb-2 text-sm">{product.category}</p>
          <p className="text-3xl font-bold text-green-600 mb-4">${product.price.toFixed(2)}</p>

          {product.description && (
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
          )}

          <p className="text-sm mb-6">
            <strong>Stock:</strong> {product.stock}
          </p>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>

      </div>
    </section>
  );
}

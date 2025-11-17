import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  if (Number.isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full max-h-96 object-cover rounded-lg mb-6"
      />
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-2xl font-semibold mb-4">${product.price}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
    </div>
  );
}

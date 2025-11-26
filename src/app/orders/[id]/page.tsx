import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ⬇ FIX: unwrap async params
  const { id } = await params;

  const orderId = Number(id);

  if (Number.isNaN(orderId)) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });

  if (!order) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>

      <p className="text-gray-600 mb-8">
        Status: <span className="font-semibold text-blue-600">{order.status}</span>
      </p>

      <div className="space-y-6 mb-10">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white p-4 rounded shadow">
            <div className="relative w-24 h-24 bg-gray-100 rounded">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-contain p-1"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.product.name}</h2>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="font-semibold mt-2">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-8" />

      <div className="text-xl font-bold">Total Paid: ${order.total.toFixed(2)}</div>
    </main>
  );
}

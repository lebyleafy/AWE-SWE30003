import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  const userId = Number(session.user.id);

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) redirect("/cart");

  const subtotal = cart.items.reduce(
    (s, it) => s + it.product.price * it.quantity,
    0
  );
  const shipping = 10;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((it) => (
            <div key={it.id} className="flex gap-4 bg-white p-4 rounded shadow">
              <div className="relative w-24 h-24">
                <Image
                  src={it.product.imageUrl}
                  alt={it.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{it.product.name}</h3>
                <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                <p className="font-semibold mt-2">
                  ${(it.product.price * it.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <CheckoutForm total={total} />
        </aside>
      </div>
    </main>
  );
}

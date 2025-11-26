// src/app/cart/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import CartItemControls from "@/app/cart/CardItemControls";
import type { Product } from "@prisma/client";
import CheckoutButton from "@/components/CheckoutButton";

type CartItemWithProduct = {
  id: number;
  quantity: number;
  cartId: number;
  productId: number;
  product: Product;
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/signin");
  }

  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    redirect("/signin");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  const items: CartItemWithProduct[] = cart?.items ?? [];

  const subtotal = items.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 bg-white p-4 rounded shadow">
                <div className="w-28 h-28 relative">
                  <Image
                    src={it.product.imageUrl}
                    alt={it.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{it.product.name}</h3>
                  <p className="text-sm text-gray-500">{it.product.category}</p>
                  <p className="mt-2 font-semibold">${it.product.price.toFixed(2)}</p>
                  <div className="mt-3">
                    <CartItemControls cartItemId={it.id} initialQuantity={it.quantity} />
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-semibold">${(it.product.price * it.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Shipping and taxes calculated at checkout.
            </p>

            <CheckoutButton />
          </aside>
        </div>
      )}
    </main>
  );
}

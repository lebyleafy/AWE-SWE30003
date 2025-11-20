// src/app/api/checkout/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const userId = Number(session.user.id);

  const body = await req.json().catch(() => ({}));
  // body could contain shipping info etc
  // Load cart
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
  }

  const total = cart.items.reduce((s, it) => s + it.product.price * it.quantity, 0);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "pending",
        },
      });

      for (const it of cart.items) {
        if (it.product.stock < it.quantity) {
          throw new Error(`Not enough stock for ${it.product.name}`);
        }

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: it.productId,
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
          },
        });

        await tx.product.update({
          where: { id: it.productId },
          data: { stock: it.product.stock - it.quantity },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return newOrder;
    });

    return new Response(JSON.stringify({ success: true, orderId: order.id }), { status: 200 });
  } catch (err: any) {
    console.error("checkout error:", err);
    return new Response(JSON.stringify({ error: err.message || "Checkout failed" }), { status: 500 });
  }
}

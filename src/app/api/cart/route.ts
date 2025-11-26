// src/app/api/cart/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const userId = Number(session.user.id);

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return new Response(JSON.stringify({ cart }), { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const userId = Number(session.user.id);

  const body = await req.json();
  const productId = Number(body.productId);
  const quantity = Number(body.quantity ?? 1);

  if (!productId || Number.isNaN(productId)) {
    return new Response(JSON.stringify({ error: "Product ID required" }), { status: 400 });
  }

  // find or create cart for user
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // check existing item
  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const { cartItemId, quantity } = await req.json();
  if (!cartItemId || typeof quantity !== "number") {
    return new Response(JSON.stringify({ error: "cartItemId and numeric quantity required" }), { status: 400 });
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: Number(cartItemId) } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  await prisma.cartItem.update({
    where: { id: Number(cartItemId) },
    data: { quantity: Number(quantity) },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const { cartItemId } = await req.json();
  if (!cartItemId) {
    return new Response(JSON.stringify({ error: "cartItemId required" }), { status: 400 });
  }

  await prisma.cartItem.delete({ where: { id: Number(cartItemId) } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

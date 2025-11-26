import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = Number(session.user.id);
  const { address, paymentMethod } = await req.json();

  // get cart
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
  }

  const subtotal = cart.items.reduce(
    (s, it) => s + it.product.price * it.quantity,
    0
  );
  const shipping = 10;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // create order
      const orderStatus = paymentMethod === "cod" ? "pending" : "processing";

      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: orderStatus,
        },
      });

      // create order items
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          },
        });

        // reduce stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: item.product.stock - item.quantity },
        });
      }

      // clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return new Response(JSON.stringify({ orderId: order.id }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Checkout failed" }), { status: 500 });
  }
}

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = Number(session.user.id);
    const { address } = await req.json(); // optional, can ignore for now

    // 1️⃣ GET CART
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart empty" }), {
        status: 400,
      });
    }

    // 2️⃣ CALCULATE TOTAL
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shipping = 10;
    const tax = subtotal * 0.08;
    const total = subtotal + tax + shipping;

    // 3️⃣ CREATE ORDER BEFORE PAYMENT
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "pending_paid",
      },
    });

    // 4️⃣ PREPARE STRIPE LINE ITEMS
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [
            `${process.env.NEXT_PUBLIC_BASE_URL}${item.product.imageUrl}`,
          ],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    // 5️⃣ CREATE STRIPE CHECKOUT SESSION
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderId: order.id.toString(),
        userId: userId.toString(),
      },
    });

    return new Response(JSON.stringify({ url: stripeSession.url }), {
      status: 200,
    });

  } catch (err: any) {
    console.error("STRIPE ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

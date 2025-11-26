import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = Number(params.id);

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid" },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

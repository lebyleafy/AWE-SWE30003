import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = Object.fromEntries(await req.formData());

  const product = await prisma.product.create({
    data: {
      name: String(data.name),
      description: String(data.description || ""),
      price: Number(data.price),
      category: String(data.category),
      imageUrl: String(data.imageUrl),
    },
  });

  return NextResponse.json({ success: true, product });
}

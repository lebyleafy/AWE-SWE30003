
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise here too!
) {
  const { id } = await params;                 // ← MUST await
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const data = Object.fromEntries(await req.formData());

  // Optional: sanitize/validate data here
  const { name, description, price, category, imageUrl } = data;

  try {
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name as string,
        description: (description as string) || null,
        price: parseFloat(price as string),
        category: category as string,
        imageUrl: imageUrl as string,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
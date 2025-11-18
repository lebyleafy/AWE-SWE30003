import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user", // default role
      },
    });

    return new Response(
      JSON.stringify({ success: true, userId: user.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}

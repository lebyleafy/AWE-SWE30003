import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Admin Account
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@awe.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  // Normal User
  await prisma.user.create({
    data: {
      name: "Customer",
      email: "vy0123@gmail.com",
      password: await bcrypt.hash("0123456789", 10),
      role: "user",
    },
  });
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

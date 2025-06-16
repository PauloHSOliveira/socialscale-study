import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  const password = await bcrypt.hash("123456", 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "ana@example.com" },
      update: {},
      create: {
        email: "ana@example.com",
        username: "ana",
        password,
        name: "Ana",
        bio: "Gosto de plantar coisas.",
      },
    }),
    prisma.user.upsert({
      where: { email: "joao@example.com" },
      update: {},
      create: {
        email: "joao@example.com",
        username: "joao",
        password,
        name: "João",
        bio: "Corredor de fim de semana.",
      },
    }),
    prisma.user.upsert({
      where: { email: "maria@example.com" },
      update: {},
      create: {
        email: "maria@example.com",
        username: "maria",
        password,
        name: "Maria",
        bio: "Fotógrafa amadora.",
      },
    }),
  ]);

  console.log("✅ Seeded users:", users.map((u) => u.username).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

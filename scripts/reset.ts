import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function reset() {
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

reset()
  .then(() => {
    console.log("Banco limpo com sucesso!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Erro ao limpar banco", e);
    process.exit(1);
  });

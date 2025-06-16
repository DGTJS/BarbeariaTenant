// 1. Importa o client gerado pelo Prisma
import { PrismaClient } from "@/generated/prisma"; // ou "@prisma/client" se for o padrão

// 2. Declara que vamos usar uma variável global pra guardar a instância do Prisma
declare global {
  var cachedPrisma: PrismaClient | undefined;
}

// 3. Cria a variável local que vai ser exportada no final
let prisma: PrismaClient;

// 4. Se estiver em produção, cria um novo PrismaClient normalmente
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // 5. Se estiver em desenvolvimento, reutiliza a instância se já existir
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

// 6. Exporta a instância para ser usada no projeto inteiro
export const db = prisma;

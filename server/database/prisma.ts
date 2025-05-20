import { Logger } from "borgen";
import { PrismaClient } from "../prisma/generated/prisma/client";
import seedDatabase from "../prisma/seed";
import seedSampleData from "../prisma/seedSampleData";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["info", "warn", "error"], // Enable Prisma logs
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Test connection
async function initializeConnection() {
  try {
    await prisma.$connect();

    await seedDatabase();
    await seedSampleData();

    Logger.info({
      message: "✅ Prisma connected to the database successfully!",
    });
  } catch (error) {
    Logger.error({ message: "❌ Error connecting to the database: " + error });
    process.exit(1);
  }
}

initializeConnection();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  Logger.error({ message: "🚪 Prisma disconnected." });
  process.exit(0);
});

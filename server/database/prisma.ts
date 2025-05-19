import { Logger } from 'borgen'
import { PrismaClient } from '../prisma/generated/prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['info', 'warn', 'error'], // Enable Prisma logs
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Test connection
async function testConnection() {
  try {
    await prisma.$connect()

    Logger.info({
      message: '✅ Prisma connected to the database successfully!',
    })
  } catch (error) {
    Logger.error({ message: '❌ Error connecting to the database: ' + error })
    process.exit(1)
  }
}

testConnection()

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  Logger.error({ message: '🚪 Prisma disconnected.' })
  process.exit(0)
})

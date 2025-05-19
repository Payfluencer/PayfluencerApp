import 'dotenv/config'
import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import router from './router/router'
import compression from 'compression'
import { Borgen, Logger } from 'borgen'
import { Config } from './utils/config'
import cookieParser from 'cookie-parser'
import { prisma } from './database/prisma'
import { rateLimit } from 'express-rate-limit'

const app = express()


const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Middleware
app.use(
  cors({
    origin: [Config.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(helmet())
app.use(Borgen({}))
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(limiter)

app.use('/', router)

const startServer = async () => {
  app.listen(Config.SERVER_PORT, () => {
    Logger.info({
      message: `Server is listening on port ${Config.SERVER_PORT}`,
      messageColor: 'greenBright',
      infoColor: 'whiteBright',
    })
  })
}

// Start Server
startServer()

// Graceful shutdown
// Close Prisma when the server shuts down
app.on('SIGTERM', async () => {
  await prisma.$disconnect()
  Logger.error({ message: '🚪 Prisma disconnected.' })
  app.close()
})

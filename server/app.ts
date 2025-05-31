import 'dotenv/config'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import http from 'http'
import router from './router/router'
import compression from 'compression'
import { Borgen, Logger } from 'borgen'
import { Config } from './lib/config'
import cookieParser from 'cookie-parser'
import { prisma } from './database/prisma'
import { helmetConfig } from './lib/helmet'
import { rateLimit } from 'express-rate-limit'
import expressBasicAuth from 'express-basic-auth'
import { apiReference } from '@scalar/express-api-reference'
import generateOpenAPISpec, {
  apiDocsServer,
  devDocsServer,
} from './docs/openapi'
import { setupSocketServer } from './sockets'

const app = express()
const server = http.createServer(app)

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Middleware
app.use(
  cors({
    origin: [Config.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(helmet(helmetConfig))
app.use(Borgen({}))
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(limiter)

// API Reference
app.use(
  '/api/v1/openapi',
  express.static(path.join(__dirname, './docs/openapi.json')),
)
app.use(
  '/api/v1/docs',
  expressBasicAuth({
    users: { [Config.API_DOCS_USER]: Config.API_DOCS_PASSWORD },
    challenge: true,
    realm: 'payfluencer_api_docs',
  }),
  apiReference({
    url: `${Config.NODE_ENV == 'dev' ? devDocsServer : apiDocsServer}/api/v1/openapi`,
  }),
)

// Routes Setup
app.use('/', router)

const startServer = async () => {
  // Generate OpenAPI spec
  if (Config.NODE_ENV == 'dev') {
    generateOpenAPISpec()
  }

  // Initialize Socket.IO
  setupSocketServer(server, '/chat/ws')

  server.listen(Config.SERVER_PORT, () => {
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
})

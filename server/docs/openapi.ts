import fs from 'fs'
import path from 'path'
import { Logger } from 'borgen'
import { Config } from '../lib/config'
import swaggerJSDoc from 'swagger-jsdoc'

const isProduction = process.env.NODE_ENV === 'production'
export const apiDocsServer = isProduction
  ? `https://payfluence.xyz`
  : `http://localhost:${Config.SERVER_PORT}`

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Payfluence API',
    version: 'v1.0.0',
    description: `
Payfluencer is a creator monetization platform that connects brands with content creators through performance-based bounties. This API enables both creators and companies to interact with the platform programmatically and manage workflows including bounty listing, content submission, review, and communication.

Core Capabilities:
- Creator authentication and profile management
- Company bounty creation with detailed targeting criteria
- Submission of creator content for review and reward tracking
- Real-time chat between creators, clients, and platform admins
- Status tracking for content submissions (Draft, Submitted, Accepted, Paid)

Authentication:
All endpoints require authentication using Supabase JWT tokens. Only Gmail-based authentication is currently supported.

Content Guidelines:
Bounty listings may include content restrictions such as language, age rating, platform, and visibility requirements.

For support or questions, contact the Payfluencer team at support@payfluencer.xyz.
`,
    license: {
      name: 'Copyright 2025 Payfluence',
    },
  },
  servers: [
    {
      url: apiDocsServer,
    },
  ],
}

const generateOpenAPISpec = () => {
  const swaggerSpec = swaggerJSDoc({
    failOnErrors: true,
    definition: swaggerDefinition,
    apis: [path.join(__dirname, '../controllers/**/*Controller.ts')],
  })

  fs.writeFileSync(
    path.join(__dirname, 'openapi.json'),
    JSON.stringify(swaggerSpec, null, 2),
    'utf-8',
  )

  Logger.info({ message: 'Swagger spec generated successfully' })
}

export default generateOpenAPISpec

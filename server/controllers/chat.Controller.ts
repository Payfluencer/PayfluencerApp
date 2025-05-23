import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import { CreateChatSchema, PaginationSchema } from "../types/zod-schema";
import { UserRole } from "../prisma/generated/prisma/client";

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: The chat ID
 *         report_id:
 *           type: string
 *           description: Optional ID of the associated report
 *         user_id:
 *           type: string
 *           description: User ID who sent the message
 *         company_id:
 *           type: string
 *           description: Optional company ID for company chats
 *         is_admin:
 *           type: boolean
 *           description: Indicates if admin is involved in chat
 *         is_company:
 *           type: boolean
 *           description: Indicates if company is involved in chat
 *         message:
 *           type: string
 *           description: The chat message content
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the message was sent
 *     CreateChatRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         report_id:
 *           type: string
 *           description: Optional ID of the associated report
 *         message:
 *           type: string
 *           description: The chat message content
 *         company_id:
 *           type: string
 *           description: Optional company ID for company chats
 *         is_admin:
 *           type: boolean
 *           description: Indicates if admin is involved in chat
 *         is_company:
 *           type: boolean
 *           description: Indicates if company is involved in chat
 */

/**
 * @openapi
 * /api/v1/chat:
 *   post:
 *     summary: Create a new chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChatRequest'
 *     responses:
 *       200:
 *         description: Chat message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Chat message created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chat:
 *                       $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createChat = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const parsedBody = CreateChatSchema.safeParse(req.body);

    if (!parsedBody.success) {
      Logger.error({
        message:
          "Invalid chat data provided: " +
          JSON.stringify(parsedBody.error.errors),
      });
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid chat data provided",
        data: null,
      });
    }

    const { report_id, message, company_id, is_admin, is_company } =
      parsedBody.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: "error",
        message: "User not authenticated",
        data: null,
      });
    }

    // Create new chat message
    const newChat = await prisma.chat.create({
      data: {
        report_id,
        user_id: userId,
        company_id,
        is_admin: is_admin || false,
        is_company: is_company || false,
        message,
      },
    });

    return res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Chat message created successfully",
      data: { chat: newChat },
    });
  } catch (error) {
    Logger.error({ message: "Error creating chat message: " + error });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error creating chat message",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/chat/report/{reportId}:
 *   get:
 *     summary: Get all chats for a specific report (for companies)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reportId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Chats retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Chat'
 *                     totalChats:
 *                       type: integer
 *                       example: 42
 *                       description: Total number of chats matching the criteria
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of records per page
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of pages available
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to access these chats
 *       500:
 *         description: Server error
 */
export const getChatsByReportId = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { reportId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: "error",
        message: "User not authenticated",
        data: null,
      });
    }

    // For COMPANY_MANAGER, check if they are authorized to access these chats
    if (userRole === UserRole.COMPANY_MANAGER) {
      // Get the company managed by this user
      const company = await prisma.company.findUnique({
        where: { manager_id: userId },
      });

      if (!company) {
        return res.status(HttpStatusCode.Forbidden).json({
          status: "error",
          message: "Not authorized to access these chats",
          data: null,
        });
      }

      // Verify the report belongs to a bounty from this company
      const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: { bounty: true },
      });

      if (!report || report.bounty.company_id !== company.id) {
        return res.status(HttpStatusCode.Forbidden).json({
          status: "error",
          message: "Not authorized to access these chats",
          data: null,
        });
      }
    }

    // Get all chats for the report
    // Validate pagination parameters
    const paginationResult = PaginationSchema.safeParse({
      page: req.query.page,
      limit: req.query.limit,
    });

    if (!paginationResult.success) {
      Logger.error({
        message:
          "Invalid pagination parameters: " +
          JSON.stringify(paginationResult.error.errors),
      });
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid pagination parameters",
        data: null,
      });
    }

    const { page, limit } = paginationResult.data;
    const skip = (page - 1) * limit;

    const [chats, totalChats] = await Promise.all([
      prisma.chat.findMany({
        where: {
          report_id: reportId,
        },
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_picture: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.chat.count({
        where: {
          report_id: reportId,
        },
      }),
    ]);

    return res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Chats retrieved successfully",
      data: {
        chats,
        totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit),
      },
    });
  } catch (error) {
    Logger.error({ message: "Error retrieving chats by report ID: " + error });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving chats",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/chat/company:
 *   get:
 *     summary: Get all chats for the company of the manager
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Company chats retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Chat'
 *                     totalChats:
 *                       type: integer
 *                       example: 42
 *                       description: Total number of chats matching the criteria
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of records per page
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of pages available
 *       401:
 *         description: Unauthorized - Not a company manager
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */
export const getCompanyChats = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== UserRole.COMPANY_MANAGER) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: "error",
        message: "User not authenticated or not a company manager",
        data: null,
      });
    }

    // Get the company managed by this user
    const company = await prisma.company.findUnique({
      where: { manager_id: userId },
    });

    if (!company) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Company not found for this manager",
        data: null,
      });
    }

    // Get all chats for the company
    // Validate pagination parameters
    const paginationResult = PaginationSchema.safeParse({
      page: req.query.page,
      limit: req.query.limit,
    });

    if (!paginationResult.success) {
      Logger.error({
        message:
          "Invalid pagination parameters: " +
          JSON.stringify(paginationResult.error.errors),
      });
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid pagination parameters",
        data: null,
      });
    }

    const { page, limit } = paginationResult.data;
    const skip = (page - 1) * limit;

    const [chats, totalChats] = await Promise.all([
      prisma.chat.findMany({
        where: {
          company_id: company.id,
        },
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_picture: true,
            },
          },
          report: {
            select: {
              id: true,
              title: true,
              bounty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.chat.count({
        where: {
          company_id: company.id,
        },
      }),
    ]);

    return res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company chats retrieved successfully",
      data: {
        chats,
        totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit),
      },
    });
  } catch (error) {
    Logger.error({ message: "Error retrieving company chats: " + error });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving company chats",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/chat/user:
 *   get:
 *     summary: Get all chats for the logged-in user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User chats retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chats:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Chat'
 *                     totalChats:
 *                       type: integer
 *                       example: 42
 *                       description: Total number of chats matching the criteria
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of records per page
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of pages available
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getUserChats = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: "error",
        message: "User not authenticated",
        data: null,
      });
    }

    // Get all chats for the user
    // Validate pagination parameters
    const paginationResult = PaginationSchema.safeParse({
      page: req.query.page,
      limit: req.query.limit,
    });

    if (!paginationResult.success) {
      Logger.error({
        message:
          "Invalid pagination parameters: " +
          JSON.stringify(paginationResult.error.errors),
      });
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid pagination parameters",
        data: null,
      });
    }

    const { page, limit } = paginationResult.data;
    const skip = (page - 1) * limit;

    const [chats, totalChats] = await Promise.all([
      prisma.chat.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          created_at: "asc",
        },
        include: {
          report: {
            select: {
              id: true,
              title: true,
              bounty: {
                select: {
                  id: true,
                  title: true,
                  company: {
                    select: {
                      id: true,
                      name: true,
                      logo: true,
                    },
                  },
                },
              },
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.chat.count({
        where: {
          user_id: userId,
        },
      }),
    ]);

    // Group chats by report or direct conversation
    const groupedChats = chats.reduce((acc, chat) => {
      const key =
        chat.report_id ||
        (chat.is_admin ? "admin" : chat.company_id || "unknown");

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(chat);
      return acc;
    }, {} as Record<string, typeof chats>);

    return res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "User chats retrieved successfully",
      data: {
        chats: groupedChats,
        totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit),
      },
    });
  } catch (error) {
    Logger.error({ message: "Error retrieving user chats: " + error });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving user chats",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/chat/all:
 *   get:
 *     summary: Get all chats (admin only)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: All chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: All chats retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Chat'
 *                     totalChats:
 *                       type: integer
 *                       example: 42
 *                       description: Total number of chats matching the criteria
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of records per page
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of pages available
 *       401:
 *         description: Unauthorized - Not an admin
 *       500:
 *         description: Server error
 */
export const getAllChats = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== UserRole.ADMIN) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: "error",
        message: "User not authenticated or not an admin",
        data: null,
      });
    }

    // Get all chats
    // Validate pagination parameters
    const paginationResult = PaginationSchema.safeParse({
      page: req.query.page,
      limit: req.query.limit,
    });

    if (!paginationResult.success) {
      Logger.error({
        message:
          "Invalid pagination parameters: " +
          JSON.stringify(paginationResult.error.errors),
      });
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid pagination parameters",
        data: null,
      });
    }

    const { page, limit } = paginationResult.data;
    const skip = (page - 1) * limit;

    const [chats, totalChats] = await Promise.all([
      prisma.chat.findMany({
        orderBy: {
          created_at: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_picture: true,
            },
          },
          report: {
            select: {
              id: true,
              title: true,
              bounty: {
                select: {
                  id: true,
                  title: true,
                  company: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.chat.count(),
    ]);

    return res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "All chats retrieved successfully",
      data: {
        chats,
        totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit),
      },
    });
  } catch (error) {
    Logger.error({ message: "Error retrieving all chats: " + error });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving all chats",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/chat/{chatId}:
 *   get:
 *     summary: Get a specific chat by ID (admin only)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Chat retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chat:
 *                       $ref: '#/components/schemas/Chat'
 *       401:
 *         description: Unauthorized - Not an admin
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
export const getChatById = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== UserRole.ADMIN) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: "error",
        message: "User not authenticated or not an admin",
        data: null,
      });
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true,
          },
        },
        report: {
          select: {
            id: true,
            title: true,
            bounty: {
              select: {
                id: true,
                title: true,
                company: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!chat) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Chat not found",
        data: null,
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Chat retrieved successfully",
      data: { chat },
    });
  } catch (error) {
    Logger.error({ message: "Error retrieving chat by ID: " + error });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving chat",
      data: null,
    });
  }
};

/**
 * WebSocket integration can be implemented for real-time chat functionality.
 * This implementation will depend on the WebSocket library used and the specifics of
 * how real-time communication is set up in the application.
 *
 * Recommended implementation approaches:
 * 1. Use Socket.io for WebSocket support
 * 2. Create socket event handlers for:
 *    - Joining chat rooms based on report ID or direct chat parameters
 *    - Sending messages
 *    - Typing indicators
 *    - Read receipts
 * 3. Implement authentication for WebSocket connections
 * 4. Store messages in the database using the existing Chat model
 *
 * Example implementation:
 *
 * export const setupWebSocketHandlers = (io) => {
 *   io.on('connection', (socket) => {
 *     // Authenticate socket connection
 *     // ...
 *
 *     socket.on('join-room', (roomId) => {
 *       socket.join(roomId);
 *     });
 *
 *     socket.on('send-message', async (data) => {
 *       // Save to database using prisma
 *       const newMessage = await prisma.chat.create({
 *         data: {
 *           // ...message data
 *         }
 *       });
 *
 *       // Broadcast to room
 *       io.to(data.roomId).emit('new-message', newMessage);
 *     });
 *   });
 * };
 */

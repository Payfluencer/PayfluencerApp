import http from "http";
import { Server, Socket } from "socket.io";
import { Logger } from "borgen";
import { prisma } from "../database/prisma";
import { Config } from "../lib/config";
import { verifyJwtToken } from "../lib/utils";

interface ChatMessage {
  chatId: string;
  content: string;
}

interface JoinRoomData {
  reportId?: string;
  chatId?: string;
}

// Map to track chat rooms and their connected users
const chatRooms = new Map<string, Set<string>>();

export function setupSocketServer(server: http.Server, path: string) {
  const io = new Server(server, {
    path,
    cors: {
      origin: Config.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware for authentication
  io.use((socket, next) => {
    try {
      // Extract cookie from handshake headers
      const cookieStr = socket.handshake.headers.cookie;
      if (!cookieStr) {
        return next(new Error("Authentication required"));
      }

      // Parse cookies and find the auth cookie (_insr010usr)
      const cookies = cookieStr.split(";").reduce((acc, curr) => {
        const [key, value] = curr.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const token = cookies._insr010usr;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Verify JWT token using the existing utility function
      const decoded = verifyJwtToken(token);
      if (decoded.status === "error") {
        return next(new Error("Invalid authentication token"));
      }

      // Extract user ID and role from token
      const userId = decoded.data.signed.token;
      const userRole = decoded.data.signed.role;

      // Store user information in socket for later use
      socket.data.userId = userId;
      socket.data.userRole = userRole;

      next();
    } catch (error) {
      Logger.error({
        message: `Socket authentication error: ${error}`,
      });
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket: Socket) => {
    Logger.info({
      message: `Socket connected: ${socket.id}`,
      messageColor: "blueBright",
    });

    // Join a chat room
    socket.on("chat:join", async (data: JoinRoomData) => {
      try {
        // Get userId from authenticated socket
        const userId = socket.data.userId;
        const userRole = socket.data.userRole;
        const { reportId, chatId } = data;

        if (!userId) {
          socket.emit("error", {
            status: "error",
            message: "User ID is required to join a chat room",
            data: null,
          });
          return;
        }

        // Create a unique room ID based on the chat parameters
        let roomId: string;
        let chat;

        // Admin can join any chat directly via chatId
        if (chatId && userRole === "ADMIN") {
          // Admin joining a specific chat
          chat = await prisma.chat.findUnique({
            where: { id: chatId }
          });

          if (!chat) {
            socket.emit("error", {
              status: "error",
              message: "Chat not found",
              data: null,
            });
            return;
          }

          // Determine room ID from the chat
          if (chat.report_id) {
            roomId = `report_${chat.report_id}`;
          } else {
            roomId = `admin_user_${chat.user_id}`;
          }
        } 
        // Company manager joining a report chat
        else if (reportId && userRole === "COMPANY_MANAGER") {
          // Get the company managed by this user
          const manager = await prisma.user.findUnique({
            where: { id: userId },
            include: { managedCompany: true }
          });

          if (!manager?.managedCompany) {
            socket.emit("error", {
              status: "error",
              message: "You don't manage any company",
              data: null,
            });
            return;
          }

          // Check if report belongs to the company
          const report = await prisma.report.findUnique({
            where: { 
              id: reportId,
            },
            include: {
              bounty: true
            }
          });

          if (!report) {
            socket.emit("error", {
              status: "error",
              message: "Report not found",
              data: null,
            });
            return;
          }

          if (report.bounty.company_id !== manager.managedCompany.id) {
            socket.emit("error", {
              status: "error",
              message: "This report does not belong to your company",
              data: null,
            });
            return;
          }

          // Find or create chat for this report
          chat = await findOrCreateReportChat(report.user_id, reportId);
          roomId = `report_${reportId}`;
        }
        // Regular user joining a report chat
        else if (reportId) {
          // Regular user joining a report chat
          const report = await prisma.report.findUnique({
            where: { 
              id: reportId,
              user_id: userId // Ensure user owns this report
            }
          });

          if (!report) {
            socket.emit("error", {
              status: "error",
              message: "Report not found or you don't have access",
              data: null,
            });
            return;
          }

          chat = await findOrCreateReportChat(userId, reportId);
          roomId = `report_${reportId}`;
        } 
        // User requesting admin chat
        else {
          // This is a direct user-to-admin chat
          chat = await findOrCreateAdminChat(userId);
          roomId = `admin_user_${userId}`;
        }

        // Join the socket to the room
        socket.join(roomId);

        // Add user to the room tracking
        if (!chatRooms.has(roomId)) {
          chatRooms.set(roomId, new Set<string>());
        }
        chatRooms.get(roomId)?.add(userId);

        // Send success response
        socket.emit("chat:join", {
          status: "success",
          message: `Joined chat room ${roomId}`,
          data: { chatId: chat.id },
        });

        // Broadcast online status update
        updateRoomOnlineStatus(io, roomId);

        Logger.info({
          message: `User ${userId} joined room ${roomId}`,
          messageColor: "greenBright",
        });
      } catch (error) {
        Logger.error({
          message: `Error joining chat: ${error}`,
        });
        socket.emit("error", {
          status: "error",
          message: "Error joining chat room",
          data: null,
        });
      }
    });

    // Get chat history
    socket.on("chat:history", async (data: { chatId: string }) => {
      try {
        const { chatId } = data;

        if (!chatId) {
          socket.emit("error", {
            status: "error",
            message: "Chat ID is required",
            data: null,
          });
          return;
        }

        // Get chat messages
        const messages = await prisma.message.findMany({
          where: { chat_id: chatId },
          orderBy: { created_at: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        });

        // Get chat details
        const chat = await prisma.chat.findUnique({
          where: { id: chatId },
          include: {
            report: true,
            company: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        });

        if (!chat) {
          socket.emit("error", {
            status: "error",
            message: "Chat not found",
            data: null,
          });
          return;
        }

        // Calculate online status
        let roomId: string;
        if (chat.report_id) {
          roomId = `report_${chat.report_id}`;
        } else {
          roomId = `admin_user_${chat.user_id}`; // Use admin chat as default
        }

        const onlineStatus =
          chatRooms.has(roomId) && chatRooms.get(roomId)!.size > 1;

        socket.emit("chat:history", {
          status: "success",
          message: "Chat history fetched successfully",
          data: {
            messages,
            chat,
            online: onlineStatus,
          },
        });
      } catch (error) {
        Logger.error({
          message: `Error fetching chat history: ${error}`,
        });
        socket.emit("error", {
          status: "error",
          message: "Error fetching chat history",
          data: null,
        });
      }
    });

    // Send a message
    socket.on("chat:message", async (data: ChatMessage) => {
      try {
        // Get the authenticated user ID from socket data
        const senderId = socket.data.userId;
        const { chatId, content } = data;

        if (!chatId || !senderId || !content) {
          socket.emit("error", {
            status: "error",
            message: "Chat ID and content are required",
            data: null,
          });
          return;
        }

        // Get the chat to determine the room
        const chat = await prisma.chat.findUnique({
          where: { id: chatId },
        });

        if (!chat) {
          socket.emit("error", {
            status: "error",
            message: "Chat not found",
            data: null,
          });
          return;
        }

        // Create the message
        const newMessage = await prisma.message.create({
          data: {
            chat_id: chatId,
            sender_id: senderId,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        });

        // Determine the room ID based on chat type
        let roomId: string;
        if (chat.report_id) {
          roomId = `report_${chat.report_id}`;
        } else {
          roomId = `admin_user_${chat.user_id}`; // Default to admin chat
        }

        // Calculate online status
        const onlineStatus =
          chatRooms.has(roomId) && chatRooms.get(roomId)!.size > 1;

        // Broadcast the message to all clients in the room
        io.to(roomId).emit("chat:message", {
          status: "success",
          message: "Message sent successfully",
          data: {
            message: newMessage,
            online: onlineStatus,
          },
        });

        Logger.info({
          message: `Message sent in room ${roomId} by ${senderId}`,
          messageColor: "blueBright",
        });
      } catch (error) {
        Logger.error({
          message: `Error sending message: ${error}`,
        });
        socket.emit("error", {
          status: "error",
          message: "Error sending message",
          data: null,
        });
      }
    });

    // Handle typing indicator
    socket.on("chat:typing", (data: { chatId: string; isTyping: boolean }) => {
      try {
        // Get the authenticated user ID from socket data
        const userId = socket.data.userId;
        const { chatId, isTyping } = data;

        if (!userId || !chatId) {
          socket.emit("error", {
            status: "error",
            message: "Chat ID is required",
            data: null,
          });
          return;
        }

        // Get the chat to determine the room
        prisma.chat
          .findUnique({
            where: { id: chatId },
          })
          .then((chat) => {
            if (!chat) {
              socket.emit("error", {
                status: "error",
                message: "Chat not found",
                data: null,
              });
              return;
            }

            // Determine the room ID based on chat type
            const roomId = chat.report_id
              ? `report_${chat.report_id}`
              : `admin_user_${chat.user_id}`;

            // Broadcast typing status to all clients in the room except sender
            socket.to(roomId).emit("chat:typing", {
              status: "success",
              message: "Typing status updated",
              data: {
                userId,
                isTyping,
              },
            });
          });
      } catch (error) {
        Logger.error({
          message: `Error updating typing status: ${error}`,
        });
      }
    });

    // Leave a chat room
    socket.on("chat:leave", (data: { roomId: string }) => {
      const { roomId } = data;
      const userId = socket.data.userId;

      if (!userId || !roomId) {
        socket.emit("error", {
          status: "error",
          message: "Room ID is required",
          data: null,
        });
        return;
      }

      leaveRoom(socket, io, roomId, userId);

      Logger.info({
        message: `User ${userId} left room ${roomId}`,
        messageColor: "yellowBright",
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const userId = socket.data.userId;

      // Leave all rooms
      if (userId) {
        leaveAllRooms(socket, io, userId);
      }

      Logger.info({
        message: `Socket disconnected: ${socket.id}`,
        messageColor: "redBright",
      });
    });
  });

  return io;
}

// Helper function to find or create a report-related chat
async function findOrCreateReportChat(userId: string, reportId: string) {
  // Check if chat already exists
  let chat = await prisma.chat.findFirst({
    where: {
      report_id: reportId,
      user_id: userId,
    },
  });

  // If not, create a new chat
  if (!chat) {
    // Verify the report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    chat = await prisma.chat.create({
      data: {
        user_id: userId,
        report_id: reportId,
      },
    });
  }

  return chat;
}

// Helper function to find or create an admin chat
async function findOrCreateAdminChat(userId: string) {
  // Check if chat already exists
  let chat = await prisma.chat.findFirst({
    where: {
      user_id: userId,
      is_admin: true,
      report_id: null,
      company_id: null,
    },
  });

  // If not, create a new chat
  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        user_id: userId,
        is_admin: true,
      },
    });
  }

  return chat;
}

// Function to update the online status of a room
function updateRoomOnlineStatus(io: Server, roomId: string) {
  const onlineStatus = chatRooms.has(roomId) && chatRooms.get(roomId)!.size > 1;

  io.to(roomId).emit("chat:online.status", {
    status: "success",
    message: "Connection status updated",
    data: { online: onlineStatus },
  });
}

// Function to leave a room
function leaveRoom(socket: Socket, io: Server, roomId: string, userId: string) {
  socket.leave(roomId);

  if (chatRooms.has(roomId)) {
    chatRooms.get(roomId)?.delete(userId);

    // Clean up empty rooms
    if (chatRooms.get(roomId)?.size === 0) {
      chatRooms.delete(roomId);
    } else {
      // Update online status for remaining users
      updateRoomOnlineStatus(io, roomId);
    }
  }
}

// Function to leave all rooms
function leaveAllRooms(socket: Socket, io: Server, userId: string) {
  // Get all rooms the socket is in
  const socketRooms = Array.from(socket.rooms).filter(
    (room) => room !== socket.id
  );

  // Leave each room
  socketRooms.forEach((roomId) => {
    leaveRoom(socket, io, roomId, userId);
  });
}

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { socketUrl } from "@/lib/config";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
  };
}

interface ChatSocketResponse {
  status: string;
  message: string;
  data: any;
}

export function useChatSocket(reportId?: string, chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(socketUrl, {
      path: "/chat/ws",
      withCredentials: true, // Important for cookie-based auth
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnecting(true);

      // Join chat room
      const joinData: { reportId?: string; chatId?: string } = {};

      if (reportId) {
        joinData.reportId = reportId;
      }
      if (chatId) {
        joinData.chatId = chatId;
      }

      newSocket.emit("chat:join", joinData);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnecting(false);
    });

    // Chat events
    newSocket.on("chat:join", (response: ChatSocketResponse) => {
      if (response.status === "success") {
        setCurrentChatId(response.data.chatId);
        setIsConnecting(false);

        // Load chat history
        newSocket.emit("chat:history", { chatId: response.data.chatId });
      } else {
        console.error("Failed to join chat:", response.message);
        setIsConnecting(false);
      }
    });

    newSocket.on("chat:history", (response: ChatSocketResponse) => {
      if (response.status === "success") {
        setMessages(response.data.messages || []);
        setIsOnline(response.data.online || false);
      }
    });

    newSocket.on("chat:message", (response: ChatSocketResponse) => {
      if (response.status === "success") {
        setMessages((prev) => [...prev, response.data.message]);
        setIsOnline(response.data.online || false);

        // Hide typing indicator for the sender
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(response.data.message.sender_id);
          return newSet;
        });
      }
    });

    newSocket.on("chat:typing", (response: ChatSocketResponse) => {
      if (response.status === "success") {
        const { userId, isTyping } = response.data;

        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      }
    });

    newSocket.on("chat:online.status", (response: ChatSocketResponse) => {
      if (response.status === "success") {
        setIsOnline(response.data.online || false);
      }
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      setIsConnecting(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [reportId, chatId]);

  const sendMessage = (chatId: string, content: string) => {
    if (socket && content.trim()) {
      socket.emit("chat:message", {
        chatId,
        content: content.trim(),
      });
    }
  };

  const leaveChat = () => {
    if (socket && currentChatId) {
      // Determine roomId based on chat type
      let roomId: string;
      if (reportId) {
        roomId = `report_${reportId}`;
      } else {
        roomId = `admin_user_${currentChatId}`;
      }

      socket.emit("chat:leave", { roomId });
    }
  };

  return {
    messages,
    isOnline: isOnline || typingUsers.size > 0,
    sendMessage,
    socket,
    currentChatId,
    isConnecting,
    typingUsers,
    leaveChat,
  };
}

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  chatType: "admin" | "report";
  reportId?: string;
  chatId?: string;
}

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

function ChatWindow({ isOpen, onClose, userId, chatType, reportId, chatId }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    messages, 
    isOnline, 
    sendMessage, 
    socket,
    currentChatId,
    isConnecting,
    typingUsers
  } = useChatSocket(chatType === "report" ? reportId : undefined, chatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !currentChatId) return;

    sendMessage(currentChatId, message);
    setMessage("");
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!socket || !currentChatId) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing = true
    socket.emit("chat:typing", {
      chatId: currentChatId,
      isTyping: true,
    });

    // Set timeout to send typing = false
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("chat:typing", {
        chatId: currentChatId,
        isTyping: false,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageSenderName = (msg: Message) => {
    if (msg.sender_id === userId) {
      return "You";
    }
    return msg.sender?.name || "Unknown";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            <h3 className="font-semibold" style={{ fontFamily: "KarlaSemiBold" }}>
              {chatType === "admin" ? "Chat with Admin" : "Report Chat"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-gray-100"
          >
            <FaTimes size={16} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isConnecting && (
            <div className="text-center text-gray-500 text-sm">
              Connecting to chat...
            </div>
          )}
          
          {!isConnecting && messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm">
              Start a conversation with the admin
            </div>
          )}

          {messages.map((msg: Message) => {
            const isMyMessage = msg.sender_id === userId;
            
            return (
              <div
                key={msg.id}
                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    isMyMessage
                      ? "bg-[#fa5e06] text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <div className="text-xs mb-1 opacity-75">
                    {getMessageSenderName(msg)} • {formatTime(msg.created_at)}
                  </div>
                  <div className="text-sm">{msg.content}</div>
                </div>
              </div>
            );
          })}

          {typingUsers.size > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 italic">
                Admin is typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isConnecting || !currentChatId}
              className="flex-1"
              style={{ fontFamily: "KarlaRegular" }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isConnecting || !currentChatId}
              className="bg-[#fa5e06] hover:bg-[#fa5e06]/80 text-white"
            >
              <FaPaperPlane size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow; 
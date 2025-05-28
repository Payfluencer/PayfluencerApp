import { useState } from "react";
import { FaUser, FaClock, FaComment } from "react-icons/fa";
import { useAdminUserChats } from "@/hooks/useAdminChats";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import AdminChatWindow from "./AdminChatWindow";

interface AdminChatListProps {
  onChatSelect?: (chatId: string, userId: string) => void;
}

function AdminChatList({ onChatSelect }: AdminChatListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminUserChats(page, 10);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleChatClick = (chatId: string, userId: string) => {
    onChatSelect?.(chatId, userId);
  };

  const getLastMessage = (chat: any) => {
    return chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <FaClock className="animate-spin mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-gray-500" style={{ fontFamily: "KarlaRegular" }}>
            Loading chats...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p style={{ fontFamily: "KarlaRegular" }}>
          Error loading chats. Please try again.
        </p>
      </div>
    );
  }

  const chats = data?.data?.chats || [];

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <FaComment className="mx-auto mb-2 text-gray-400" size={48} />
          <p className="text-gray-500 text-lg" style={{ fontFamily: "KarlaRegular" }}>
            No chats yet
          </p>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "KarlaRegular" }}>
            Users will appear here when they start conversations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const lastMessage = getLastMessage(chat);
        
        return (
          <Sheet key={chat.id}>
            <SheetTrigger asChild>
              <div
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleChatClick(chat.id, chat.user_id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* User Avatar */}
                    <div className="w-10 h-10 bg-[#fa5e06] rounded-full flex items-center justify-center text-white font-semibold">
                      {chat.user.profile_picture ? (
                        <img
                          src={chat.user.profile_picture}
                          alt={chat.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser size={16} />
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className="font-semibold text-gray-900 truncate"
                          style={{ fontFamily: "KarlaSemiBold" }}
                        >
                          {chat.user.name}
                        </h3>
                        {lastMessage && (
                          <span
                            className="text-xs text-gray-500"
                            style={{ fontFamily: "KarlaRegular" }}
                          >
                            {formatTime(lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <p
                        className="text-sm text-gray-600 truncate"
                        style={{ fontFamily: "KarlaRegular" }}
                      >
                        {chat.user.email}
                      </p>

                      {lastMessage && (
                        <p
                          className="text-sm text-gray-500 truncate mt-1"
                          style={{ fontFamily: "KarlaRegular" }}
                        >
                          {lastMessage.content}
                        </p>
                      )}

                      {!lastMessage && (
                        <p
                          className="text-sm text-gray-400 italic mt-1"
                          style={{ fontFamily: "KarlaRegular" }}
                        >
                          No messages yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle style={{ fontFamily: "KarlaSemiBold" }}>
                  Chat with {chat.user.name}
                </SheetTitle>
              </SheetHeader>
              
              <div className="h-[calc(100vh-80px)]">
                <AdminChatWindow
                  chatId={chat.id}
                  userId={chat.user_id}
                  userName={chat.user.name}
                />
              </div>
            </SheetContent>
          </Sheet>
        );
      })}

      {/* Pagination */}
      {data?.data && data.data.totalChats > data.data.limit && (
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{ fontFamily: "KarlaRegular" }}
          >
            Previous
          </Button>
          
          <span
            className="text-sm text-gray-600"
            style={{ fontFamily: "KarlaRegular" }}
          >
            Page {page} of {data.data.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page >= data.data.totalPages}
            style={{ fontFamily: "KarlaRegular" }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default AdminChatList; 
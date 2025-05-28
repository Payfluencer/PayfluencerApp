import { useQuery } from "@tanstack/react-query";
import { apiBase } from "@/lib/config";

interface AdminChat {
  id: string;
  user_id: string;
  is_admin: boolean;
  report_id: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
  };
  messages?: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    sender?: {
      id: string;
      name: string;
    };
  }[];
  report?: {
    id: string;
    title: string;
    bounty?: {
      id: string;
      title: string;
      company?: {
        id: string;
        name: string;
      };
    };
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
}

interface AdminChatsResponse {
  status: string;
  message: string;
  data: {
    chats: AdminChat[];
    totalChats: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useAdminChats(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["admin-chats", page, limit],
    queryFn: async (): Promise<AdminChatsResponse> => {
      const response = await apiBase.get(`/chat/all?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

// Filter admin chats to only show user-admin direct conversations
export function useAdminUserChats(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["admin-user-chats", page, limit],
    queryFn: async (): Promise<AdminChatsResponse> => {
      const response = await apiBase.get(`/chat/all?page=${page}&limit=${limit}`);
      
      // Filter for admin chats (is_admin = true and no report_id)
      const filteredChats = response.data.data.chats.filter((chat: AdminChat) => 
        chat.is_admin && !chat.report_id
      );
      
      return {
        ...response.data,
        data: {
          ...response.data.data,
          chats: filteredChats,
          totalChats: filteredChats.length,
        }
      };
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
} 
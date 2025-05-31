import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch } from "./useAuth";
import { serverUrl } from "@/lib/config";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface Submission {
  id: string;
  user_id: string;
  bounty_id: string;
  title: string;
  description: string;
  platform: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionResponse {
  status: string;
  message: string;
  data: {
    reports: Submission[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleSubmissionResponse {
  status: string;
  message: string;
  data: {
    report: Submission;
  };
}

export interface CreateSubmissionData {
  bounty_id: string;
  title: string;
  description: string;
  platform: string;
}

export interface UpdateSubmissionData {
  id: string;
  title?: string;
  description?: string;
  platform?: string;
}

export interface UpdateSubmissionStatusData {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
}

// Get all submissions (admin only)
export const useSubmissions = (page = 1, limit = 10, status?: string) => {
  const {
    data: submissionsResponse,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
    refetch: refetchSubmissions,
  } = useQuery<SubmissionResponse>({
    queryKey: ["submissions", page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) {
        params.append("status", status);
      }

      const response = await authenticatedFetch(
        `${serverUrl}/api/v1/report/all?${params.toString()}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as SubmissionResponse;
    },
  });

  function getSubmissionsByStatus(statusFilter: string) {
    return submissionsResponse?.data.reports.filter(
      (submission) =>
        submission.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  return {
    submissions: submissionsResponse?.data.reports || [],
    submissionsResponse,
    isSubmissionsLoading,
    submissionsError,
    refetchSubmissions,
    getSubmissionsByStatus,
    totalSubmissions: submissionsResponse?.data.total || 0,
    totalPages: submissionsResponse?.data.totalPages || 0,
  };
};

// Get single submission by ID
export const useSubmission = (id: string | undefined) => {
  const {
    data: submissionData,
    isLoading: isSubmissionLoading,
    error: submissionError,
    refetch: refetchSubmission,
  } = useQuery<SingleSubmissionResponse>({
    queryKey: ["submission", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Submission ID is required");
      }
      const response = await authenticatedFetch(
        `${serverUrl}/api/v1/report?id=${id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as SingleSubmissionResponse;
    },
    enabled: !!id,
  });

  return {
    submission: submissionData?.data.report,
    isSubmissionLoading,
    submissionError,
    refetchSubmission,
  };
};

// Get submissions by user ID
export const useUserSubmissions = (
  userId: string | undefined,
  page = 1,
  limit = 10
) => {
  const {
    data: userSubmissions,
    isLoading: isUserSubmissionsLoading,
    error: userSubmissionsError,
    refetch: refetchUserSubmissions,
  } = useQuery<SubmissionResponse>({
    queryKey: ["userSubmissions", userId, page, limit],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await authenticatedFetch(
        `${serverUrl}/api/v1/report/user/${userId}?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      return data as SubmissionResponse;
    },
    enabled: !!userId,
  });

  function getRevenueEarned() {
    // TODO: Request backend to add an amount to report/submission
    return 0;
  }

  function getPendingSubmissions() {
    return (
      userSubmissions?.data?.reports.filter(
        (submission) => submission.status.toLowerCase() === "pending"
      ) || []
    );
  }

  function getSubmissionsByStatus(status: string) {
    return (
      userSubmissions?.data?.reports.filter(
        (submission) => submission.status.toLowerCase() === status.toLowerCase()
      ) || []
    );
  }

  return {
    userSubmissions: userSubmissions?.data?.reports || [],
    isUserSubmissionsLoading,
    userSubmissionsError,
    refetchUserSubmissions,
    getRevenueEarned,
    getPendingSubmissions,
    getSubmissionsByStatus,
    totalUserSubmissions: userSubmissions?.data.total || 0,
    totalPages: userSubmissions?.data.totalPages || 0,
  };
};

// Get submissions by bounty ID
export const useBountySubmissions = (
  bountyId: string | undefined,
  page = 1,
  limit = 10
) => {
  const {
    data: bountySubmissions,
    isLoading: isBountySubmissionsLoading,
    error: bountySubmissionsError,
    refetch: refetchBountySubmissions,
  } = useQuery<SubmissionResponse>({
    queryKey: ["bountySubmissions", bountyId, page, limit],
    queryFn: async () => {
      if (!bountyId) {
        throw new Error("Bounty ID is required");
      }
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await authenticatedFetch(
        `${serverUrl}/api/v1/report/bounty/${bountyId}?${params.toString()}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as SubmissionResponse;
    },
    enabled: !!bountyId,
  });

  return {
    bountySubmissions: bountySubmissions?.data?.reports || [],
    isBountySubmissionsLoading,
    bountySubmissionsError,
    refetchBountySubmissions,
    totalBountySubmissions: bountySubmissions?.data.total || 0,
    totalPages: bountySubmissions?.data.totalPages || 0,
  };
};

// Search submissions
export const useSearchSubmissions = (title: string, page = 1, limit = 10) => {
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery<SubmissionResponse>({
    queryKey: ["searchSubmissions", title, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        title,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await authenticatedFetch(
        `${serverUrl}/api/v1/report/search?${params.toString()}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as SubmissionResponse;
    },
    enabled: !!title && title.length >= 2,
  });

  return {
    searchResults: searchResults?.data?.reports || [],
    isSearchLoading,
    searchError,
    refetchSearch,
    totalResults: searchResults?.data.total || 0,
    totalPages: searchResults?.data.totalPages || 0,
  };
};

// Create submission mutation
export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: createSubmission,
    isPending: isCreatingSubmission,
    error: createSubmissionError,
    data: createdSubmission,
  } = useMutation<SingleSubmissionResponse, Error, CreateSubmissionData>({
    mutationFn: async (submissionData: CreateSubmissionData) => {
      const response = await authenticatedFetch(`${serverUrl}/api/v1/report`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create submission");
      }

      const data = await response.json();
      return data as SingleSubmissionResponse;
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["userSubmissions"] });
      queryClient.invalidateQueries({
        queryKey: ["bountySubmissions", data.data.report.bounty_id],
      });
      navigate(`/submissions/${data.data.report.id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  return {
    createSubmission,
    isCreatingSubmission,
    createSubmissionError,
    createdSubmission,
  };
};

// Update submission mutation
export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateSubmission,
    isPending: isUpdatingSubmission,
    error: updateSubmissionError,
    data: updatedSubmission,
  } = useMutation<SingleSubmissionResponse, Error, UpdateSubmissionData>({
    mutationFn: async (submissionData: UpdateSubmissionData) => {
      const response = await authenticatedFetch(`${serverUrl}/api/v1/report`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update submission");
      }

      const data = await response.json();
      return data as SingleSubmissionResponse;
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["userSubmissions"] });
      queryClient.invalidateQueries({
        queryKey: ["submission", data.data.report.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["bountySubmissions", data.data.report.bounty_id],
      });
    },
  });

  return {
    updateSubmission,
    isUpdatingSubmission,
    updateSubmissionError,
    updatedSubmission,
  };
};

// Update submission status mutation
export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateSubmissionStatus,
    isPending: isUpdatingStatus,
    error: updateStatusError,
    data: updatedStatusSubmission,
  } = useMutation<SingleSubmissionResponse, Error, UpdateSubmissionStatusData>({
    mutationFn: async (statusData: UpdateSubmissionStatusData) => {
      const response = await authenticatedFetch(
        `${serverUrl}/api/v1/report/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statusData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update submission status"
        );
      }

      const data = await response.json();
      return data as SingleSubmissionResponse;
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["userSubmissions"] });
      queryClient.invalidateQueries({
        queryKey: ["submission", data.data.report.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["bountySubmissions", data.data.report.bounty_id],
      });
    },
  });

  return {
    updateSubmissionStatus,
    isUpdatingStatus,
    updateStatusError,
    updatedStatusSubmission,
  };
};

// Delete submission mutation
export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteSubmission,
    isPending: isDeletingSubmission,
    error: deleteSubmissionError,
  } = useMutation<
    { status: string; message: string; data: null },
    Error,
    string
  >({
    mutationFn: async (submissionId: string) => {
      const response = await authenticatedFetch(`${serverUrl}/api/v1/report`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: submissionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete submission");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["userSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["bountySubmissions"] });
    },
  });

  return {
    deleteSubmission,
    isDeletingSubmission,
    deleteSubmissionError,
  };
};

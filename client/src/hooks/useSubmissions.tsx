import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "./useAuth";

const API_URL = "http://localhost:8001";

export interface Submission {
  id: string;
  user_id: string;
  bounty_id: string;
  title: string;
  description: string;
  platform: string;
  status: string;
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

export const useSubmissions = () => {
  const {
    data: submissionsResponse,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
  } = useQuery<SubmissionResponse>({
    queryKey: ["submissions"],
    queryFn: async () => {
      const response = await authenticatedFetch(
        `${API_URL}/api/v1/report/all`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as SubmissionResponse;
    },
  });

  return {
    submissionsResponse,
    isSubmissionsLoading,
    submissionsError,
  };
};

export const useSubmission = (id: string) => {
  const {
    data: submission,
    isLoading: isSubmissionLoading,
    error: submissionError,
  } = useQuery<Submission>({
    queryKey: ["submission", id],
    queryFn: async () => {
      const response = await authenticatedFetch(
        `${API_URL}/api/v1/report?id=${id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data as Submission;
    },
  });

  return {
    submission,
    isSubmissionLoading,
    submissionError,
  };
};

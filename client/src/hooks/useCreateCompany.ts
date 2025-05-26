import { useMutation } from "@tanstack/react-query";
import { type CreateCompanyForm } from "@/pages/CreateCompany";
import { useNavigate } from "react-router-dom";

interface CreateCompanyResponse {
  status: string;
  message: string;
  data: {
    company: {
      id: string;
      name: string;
      phone_number: string;
      email: string;
      logo: string;
      description: string;
      website: string;
      address: string;
      manager: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
}

const API_URL = "http://localhost:8001/api/v1/company";

export const useCreateCompany = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async (company: CreateCompanyForm) => {
      console.log("Company:", company);
      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });
      if (!response.ok) {
        throw new Error("Failed to create company");
      }
      const data: CreateCompanyResponse = await response.json();
      return data;
    },
    onSuccess: (data) => {
      console.log("Company created successfully", data);
      navigate("/admin/companies");
    },
    onError: (error) => {
      console.error("Error creating company", error);
    },
  });

  return { mutate, isPending };
};

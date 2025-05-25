import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";

const GoogleLoginBtn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleUserLogin(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error(error);
      setIsLoading(false);
    },
  });

  const handleUserLogin = async (idToken: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8001/api/v1/auth/google",
        {
          idToken,
        }
      );

      setIsLoading(false);

      if (!response?.data?.data?.user) return toast.error("Login failed.");

      const user = response.data.data.user;
      console.log(user);
      toast.success(response.data.message);

      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={() => login()}
      disabled={isLoading}
      className="bg-[#000] text-white px-4 flex items-center w-full gap-2 py-2 rounded-xl text-xl h-12"
      style={{ fontFamily: "KarlaRegular" }}
    >
      {isLoading ? (
        <Loader size={24} className="animate-spin text-muted-foreground" />
      ) : (
        <div className="flex gap-2 items-center justify-center w-full">
          <FaGoogle /> Sign in with Google
        </div>
      )}
    </Button>
  );
};

export default GoogleLoginBtn;

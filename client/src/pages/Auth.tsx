import Lottie from "lottie-react";
import animationData from "../assets/lottie/ms.json";
import { FaGoogle } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[400px] h-[400px] rounded-md flex flex-col items-center justify-center gap-4">
        <Lottie animationData={animationData} loop={true} />
        <Button
          className="bg-[#000] text-white px-4 flex items-center w-full gap-2 py-2 rounded-md text-xl h-12"
          style={{ fontFamily: "KarlaRegular" }}
        >
          <FaGoogle /> Sign in with Google
        </Button>
        <Link
          to="/"
          className="px-4 flex items-center w-full gap-2 py-2 rounded-md text-xl h-12 justify-center"
          style={{ fontFamily: "KarlaRegular" }}
        >
          <MdHome /> Back Home
        </Link>
      </div>
    </div>
  );
}

export default Auth;

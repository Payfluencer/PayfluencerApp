import Lottie from "lottie-react";
import animationData from "../assets/lottie/ms.json";
import { FaGoogle } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[400px] h-[400px] rounded-md flex flex-col items-center justify-center gap-4">
        <Lottie animationData={animationData} loop={true} />
        <Link
          to="/home"
          className="bg-[#000] text-white px-4 flex items-center w-full gap-2 py-2 rounded-xl text-xl h-12"
          style={{ fontFamily: "KarlaRegular" }}
        >
          <div className="flex gap-2 items-center justify-center w-full">
            <FaGoogle /> Sign in with Google
          </div>
        </Link>
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

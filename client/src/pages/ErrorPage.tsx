import { Link } from "react-router-dom";
import error from "@/assets/images/error.png";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={error} alt="error" className="w-1/2 h-1/2 object-contain" />
      <h1
        className="text-lg font-bold text-gray-500"
        style={{
          fontFamily: "KarlaRegular",
        }}
      >
        Seems like you are lost😔
      </h1>
      <Link
        to="/"
        className="text-lg font-bold mt-8 underline cursor-pointer"
        style={{
          fontFamily: "KarlaSemiBold",
        }}
      >
        Back Home
      </Link>
    </div>
  );
}

export default ErrorPage;

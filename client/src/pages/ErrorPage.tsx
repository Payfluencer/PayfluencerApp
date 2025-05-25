import { Link } from "react-router-dom";
import error from "@/assets/images/error.png";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={error} alt="error" className="w-1/2 h-1/2" />
      <h1
        className="text-4xl font-bold"
        style={{
          fontFamily: "KarlaSemiBold",
        }}
      >
        Seems like you are lost
      </h1>
      <Link to="/">Back Home</Link>
    </div>
  );
}

export default ErrorPage;

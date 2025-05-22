import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

export default function MobileMenuOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black/40 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div className="flex justify-end p-4 mt-12 w-full">
        <IoMdClose size={34} onClick={onClose} color="white" />
      </div>
      <div
        className="flex flex-col items-center justify-between h-1/4"
        style={{ fontFamily: "KarlaSemiBold" }}
      >
        <Link
          to="/"
          className="mx-2 p-2 text-2xl font-bold text-white border-b-2 border-white"
        >
          For Companies
        </Link>
        <Link
          to="/auth"
          className="mx-2 p-2 text-2xl font-bold text-white border-b-2 border-white"
        >
          Sign Up
        </Link>
        <Link to="/auth" className="mx-2 p-2 text-2xl font-bold text-white">
          Sign In
        </Link>
        <Link
          to="/auth"
          className="mx-2 p-2 bg-[#FA5E06] text-white rounded-md"
        >
          Start Creating
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import logo from "../assets/images/image.png";
import { CiMenuFries } from "react-icons/ci";

function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-xs">
      <div className="flex items-center">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <h1
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          Payfluencer
        </h1>
      </div>
      <div className="items-center justify-between hidden md:flex">
        <Link
          to="https://form.typeform.com/to/L2BDZcS7"
          target="_blank"
          className="mx-2 p-2"
        >
          For Companies
        </Link>
        <Link to="/auth" className="mx-2 p-2">
          Sign Up
        </Link>
        <Link to="/auth" className="mx-2 p-2">
          Sign In
        </Link>
        <Link
          to="/all-bounties"
          className="mx-2 p-2 bg-[#FA5E06] text-white rounded-md"
        >
          Start Creating
        </Link>
      </div>
      <div className="flex items-center md:hidden">
        <CiMenuFries size={34} onClick={onMenuClick} />
      </div>
    </div>
  );
}

export default Navbar;

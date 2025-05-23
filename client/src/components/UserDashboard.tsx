import { FaBell, FaFacebookMessenger, FaUser } from "react-icons/fa";

function UserDashboard() {
  return (
    <div className="mx-2">
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-row items-center gap-2">
          <h1 style={{ fontFamily: "KarlaRegular" }} className="text-lg">
            Good Afternoon,
          </h1>
          <p style={{ fontFamily: "KarlaSemiBold" }} className="text-lg">
            Sylus Abel
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center cursor-pointer">
            <FaFacebookMessenger
              size={20}
              className="hover:text-[#FA5E06] transition-all duration-500"
            />
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <FaBell
              size={20}
              className="hover:text-[#FA5E06] transition-all duration-500"
            />
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <FaUser
              size={20}
              className="hover:text-[#FA5E06] transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

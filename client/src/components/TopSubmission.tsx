import { FaCheckCircle, FaTimes } from "react-icons/fa";

export interface TopSubmission {
  name: string;
  amount: number;
  profile: string;
  paid: boolean;
  date: string;
}

function TopSubmission({ name, amount, paid }: TopSubmission) {
  return (
    <div className="flex items-center justify-between bg-white rounded-3xl p-2 w-full">
      <div className="flex items-center gap-2">
        <p style={{ fontFamily: "KarlaRegular" }} className="text-lg">
          {name}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p
          style={{ fontFamily: "KarlaSemiBold" }}
          className={`text-sm ${paid ? "text-green-500" : "text-red-500"}`}
        >
          {paid ? (
            <FaCheckCircle color="green" />
          ) : (
            <FaTimes className="" color="red" />
          )}
        </p>
      </div>
      <p style={{ fontFamily: "KarlaSemiBold" }} className="text-lg">
        ${amount.toLocaleString()}
      </p>
    </div>
  );
}

export default TopSubmission;

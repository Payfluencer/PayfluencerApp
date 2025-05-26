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
    <div className="flex items-center justify-between w-full border border-gray-200 rounded-2xl p-2 py-4">
      <div className="flex flex-col items-start gap-2">
        <p style={{ fontFamily: "KarlaRegular" }} className="text-lg">
          {name}
        </p>
        <p
          style={{ fontFamily: "KarlaRegular" }}
          className="text-sm text-gray-500"
        >
          Platform
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

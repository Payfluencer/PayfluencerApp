import { type Bounty } from "@/hooks/useBounties";
import { FaDollarSign } from "react-icons/fa";

function TopBounties({ title, max_payout }: Bounty) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center bg-gray-900 text-white rounded-full p-2">
          <FaDollarSign />
        </div>
        <p style={{ fontFamily: "KarlaRegular" }} className="text-lg">
          {title}
        </p>
      </div>
      <p style={{ fontFamily: "KarlaSemiBold" }} className="text-lg">
        ${max_payout.toLocaleString()}
      </p>
    </div>
  );
}

export default TopBounties;

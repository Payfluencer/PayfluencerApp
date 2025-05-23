export interface TopCompaniesSummary {
  name: string;
  bounties: number;
  profile: string;
}

function TopCompaniesSummary({ name, bounties, profile }: TopCompaniesSummary) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-2">
      <div className="flex items-center gap-2">
        <img
          src={profile}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <p style={{ fontFamily: "KarlaRegular" }} className="text-lg">
          {name}
        </p>
      </div>
      <p style={{ fontFamily: "KarlaSemiBold" }} className="text-lg">
        {bounties} Bounties
      </p>
    </div>
  );
}

export default TopCompaniesSummary;

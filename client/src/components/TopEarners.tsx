import { useMemo } from "react";
import { type User as UserType } from "../hooks/useUsers";

function TopEarners({ name, email }: UserType) {
  const randomColor = useMemo(() => {
    const profileBackgroundColors = ["#fa5e06", "#3fe95e", "#1f2937"];
    return profileBackgroundColors[
      Math.floor(Math.random() * profileBackgroundColors.length)
    ];
  }, []);
  return (
    <div className="flex items-center justify-between bg-white rounded-4xl p-2 w-full md:w-1/2">
      <div className="flex items-center gap-2">
        <div
          className="rounded-full w-10 h-10 flex items-center justify-center text-sm"
          style={{
            backgroundColor: randomColor,
            color: "white",
            fontFamily: "KarlaSemiBold",
          }}
        >
          {name.charAt(0)}
        </div>
        <p style={{ fontFamily: "KarlaRegular" }} className="text-md">
          {name.slice(0, name.indexOf(" "))}
        </p>
      </div>
      <p style={{ fontFamily: "KarlaSemiBold" }} className="text-md">
        {email.slice(0, email.indexOf("@") - 3)}****
        {email.slice(email.indexOf("@") + 3)}
      </p>
    </div>
  );
}

export default TopEarners;

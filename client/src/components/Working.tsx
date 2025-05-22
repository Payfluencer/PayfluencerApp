interface WorkingProps {
  index: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Working({
  working,
  active,
  setActive,
}: {
  working: WorkingProps;
  active: number;
  setActive: (active: number) => void;
}) {
  return (
    <div
      className={`p-1 rounded-lg w-[350px] cursor-pointer hover:scale-105 transition-all duration-500 md:w-[400px] ${
        working.index === active.toString() ? "bg-[#FA5E06]" : "bg-gray-100 "
      }`}
      onClick={() => setActive(parseInt(working.index))}
    >
      <div className="border-[1px] border-[#FA5E06] rounded-lg gap-4 px-4 w-full h-full flex items-start">
        <h1
          className="text-2xl font-bold mt-2"
          style={{ fontFamily: "KarlaBold" }}
        >
          0{working.index}
        </h1>
        <div className="flex gap-2 flex-col">
          <h3
            className="text-2xl font-bold mt-2 mb-"
            style={{ fontFamily: "KarlaBold" }}
          >
            {working.title}
          </h3>
          <p
            className={`text-lg  mb-4 ${
              working.index === active.toString()
                ? "text-gray-700"
                : "text-gray-500"
            }`}
            style={{ fontFamily: "KarlaRegular" }}
          >
            {working.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Working;

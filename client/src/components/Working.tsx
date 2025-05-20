interface WorkingProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Working({ working }: { working: WorkingProps }) {
  return (
    <div className="p-1 rounded-lg bg-gray-100 w-[350px] md:w-[450px] h-[300px]">
      <div className="bg-[#fff] rounded-lg px-4 w-full h-full">
        <div className="flex items-center gap-2 flex-col">
          <div className="bg-white rounded-full p-2 mb-10 mt-4">
            {working.icon}
          </div>
          <h3
            className="text-2xl text-center font-bold my-2"
            style={{ fontFamily: "KarlaBold" }}
          >
            {working.title}
          </h3>
          <p
            className="text-lg text-center text-gray-500"
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

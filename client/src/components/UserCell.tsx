import { useUser } from "@/hooks/useUsers";

function UserCell({ id }: { id: string | undefined }) {
  const { user, isUserLoading, userError } = useUser(id);
  if (isUserLoading) {
    return <div>Loading...</div>;
  }
  if (userError) {
    return <div>Error: {userError.message}</div>;
  }
  console.log(user);
  return (
    <div className="flex items-center gap-2 md:gap-6">
      <div
        className="w-8 h-8 flex items-center justify-center rounded-full object-contain bg-gray-200"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      >
        {user?.name?.charAt(0)}
      </div>
      <div className="">
        <span
          className="text-sm text-gray-500"
          style={{ fontFamily: "KarlaSemiBold" }}
        >
          {user?.name}
        </span>
      </div>
    </div>
  );
}

export default UserCell;

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type LoggedInUser, type TRole } from "@/components/LoginInwithGoogle";

interface UserStore {
  id: string;
  email: string;
  name: string;
  role: TRole;
  isLoggedIn: boolean;
  setDetails: (data: LoggedInUser) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: "",
      email: "",
      name: "",
      role: "USER",
      isLoggedIn: false,
      setDetails: (data: LoggedInUser) =>
        set({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          isLoggedIn: true,
        }),
      logout: () =>
        set({ id: "", email: "", name: "", role: "USER", isLoggedIn: false }),
    }),
    {
      name: "user-store", // unique name for localStorage key
      // You can also add custom storage if needed
      // storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
);

export default useUserStore;

import { create } from "zustand";
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

const useUserStore = create<UserStore>((set) => ({
  id: "",
  email: "",
  name: "",
  role: "USER",
  isLoggedIn: false,
  setDetails: (data: LoggedInUser) => set({ ...data, isLoggedIn: true }),
  logout: () =>
    set({ id: "", email: "", name: "", role: "USER", isLoggedIn: false }),
}));

export default useUserStore;

import { create } from 'zustand'
import { UserRole, type LoggedInUser } from '@/components/LoginInwithGoogle'

interface UserStore {
  id: string
  email: string
  name: string
  role: UserRole
  isLoggedIn: boolean
  setDetails: (data: LoggedInUser) => void
  logout: () => void
}

const useUserStore = create<UserStore>()((set) => ({
  id: '',
  email: '',
  name: '',
  role: UserRole.USER,
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
    set({
      id: '',
      email: '',
      name: '',
      role: UserRole.USER,
      isLoggedIn: false,
    }),
}))

export default useUserStore

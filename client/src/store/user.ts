import { create } from 'zustand'
import { type LoggedInUser } from '@/components/LoginInwithGoogle'
import { UserRole } from '@/types/user'

interface UserStore {
  id: string
  email: string
  name: string
  role: UserRole
  company: {
    id: string
    name: string
    logoUrl: string | null

  }
  isLoggedIn: boolean
  setDetails: (data: LoggedInUser) => void
  logout: () => void
}

const useUserStore = create<UserStore>()((set) => ({
  id: '',
  email: '',
  name: '',
  role: UserRole.USER,
  company: {
    id: '',
    name: '',
    logoUrl: null,
  },
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

import { create } from 'zustand'
import { UserRole } from '@/types/user'

interface CompanyUser {
  id: string
  email: string
  name: string
  role: UserRole
  phoneNumber: string
  createdAt: string
  isActive: boolean
}

interface Company {
  id: string
  name: string
  phone_number: string
  email: string
  logo: string
  description: string
  website: string
  address: string
  manager: {
    id: string
    name: string
    email: string
  }
}

interface CompanyStore {
  user: CompanyUser | null
  company: Company | null
  isLoggedIn: boolean
  setCompanyDetails: (user: CompanyUser, company: Company) => void
  logout: () => void
}

const useCompanyStore = create<CompanyStore>()((set) => ({
  user: null,
  company: null,
  isLoggedIn: false,
  setCompanyDetails: (user: CompanyUser, company: Company) =>
    set({
      user,
      company,
      isLoggedIn: true,
    }),
  logout: () =>
    set({
      user: null,
      company: null,
      isLoggedIn: false,
    }),
}))

export default useCompanyStore

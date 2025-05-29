import { Loader } from 'lucide-react'
import { UserRole } from '@/types/user'
import useCompanyStore from '@/store/company'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { refreshUserAccess } from '@/actions/user'

const withCompanyAuthRequired = (ChildComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { isLoggedIn, setCompanyDetails } = useCompanyStore((state) => state)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    async function fetchUserDetails() {
      const response = await refreshUserAccess()

      if (!response) {
        setIsLoading(false)
        return navigate('/auth')
      }

      const user = response.data.user
      const company = response.data.company

      // Check role
      if(user.role !== UserRole.COMPANY_MANAGER){
          return navigate('/auth')
      }

      setCompanyDetails({ ...user, role: user.role as UserRole }, company);

      setIsLoading(false)
    }

    useEffect(() => {
      if (!isLoggedIn) {
        fetchUserDetails()
      } else {
        setIsLoading(false)
      }
    }, [])

    if (isLoading) {
      return (
        <div className='absolute bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-white'>
          <Loader className='animate-spin text-gray-300' size={32} />
          <p className='text-sm text-gray-600'>Loading...</p>
        </div>
      )
    }

    return <ChildComponent {...props} />
  }
}

export default withCompanyAuthRequired

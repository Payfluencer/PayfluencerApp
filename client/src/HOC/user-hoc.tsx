import { Loader } from 'lucide-react'
import { UserRole } from '@/types/user'
import useUserStore from '@/store/user'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { refreshUserAccess } from '@/actions/user'

const withUserAuthRequired = (ChildComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { isLoggedIn, setDetails } = useUserStore((state) => state)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    async function fetchUserDetails() {
      const response = await refreshUserAccess()

      if (!response) {
        setIsLoading(false)
        return navigate('/auth')
      }

      const user = response.data.user

      // Set global user state
      if (!user) return navigate('/auth')

      // Check role
      if(user.role !== UserRole.USER){
          return navigate('/auth')
      }

      setDetails(user);

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

export default withUserAuthRequired

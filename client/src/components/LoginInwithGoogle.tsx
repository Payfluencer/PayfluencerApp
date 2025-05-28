import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { FaGoogle } from 'react-icons/fa'
import { Button } from './ui/button'
import useUserStore from '@/store/user'
import type { UserRole } from '@/types/user'

export interface LoggedInUser {
  id: string
  email: string
  name: string
  role: UserRole
  phoneNumber: string | null
  profilePicture: string
  isActive: boolean
  isNewUser: boolean
  createdAt: string
}

const GoogleLoginBtn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setDetails } = useUserStore((state) => state)

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleUserLogin(tokenResponse.code)
    },
    flow: 'auth-code',
    onError: (error) => {
      console.error(error)
      setIsLoading(false)
    },
  })

  const handleUserLogin = async (idToken: string) => {
    try {
      console.log("idToken", idToken);
      const response = await axios.post(
        'http://localhost:8001/api/v1/auth/google',
        {
          idToken,
        },
        {
<<<<<<< HEAD
          withCredentials: true,
        }
      );
=======
          withCredentials: true, // This ensures cookies are sent and received
        },
      )
>>>>>>> 31e36a53a938dab3c359698612486c0f9f71bbba

      setIsLoading(false)

      if (!response?.data?.data?.user) return toast.error('Login failed.')

      const user = response.data.data.user as LoggedInUser

      setDetails(user)
      navigate('/home')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Try again.')
      setIsLoading(false)
    }
  }

  const handleLoginWithGoogle = () => {
    setIsLoading(true)
    login()
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader size={24} className='animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <Button
      type='button'
      onClick={handleLoginWithGoogle}
      disabled={isLoading}
      className='bg-[#000] text-white px-4 flex items-center w-full gap-2 py-2 rounded-xl text-xl h-12'
      style={{ fontFamily: 'KarlaRegular' }}
    >
      {isLoading ? (
        <Loader size={24} className='animate-spin text-muted-foreground' />
      ) : (
        <div className='flex gap-2 items-center justify-center w-full'>
          <FaGoogle /> Sign in with Google
        </div>
      )}
    </Button>
  )
}

export default GoogleLoginBtn

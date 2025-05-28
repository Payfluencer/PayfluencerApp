import { apiBase } from '@/lib/config'

// Refresh User Access
export const refreshUserAccess = async () => {
  try {
    const response = await apiBase.get('/user/refresh')

    return response.data
  } catch (error) {
      console.error('Error refreshing user access')
  }
}

// Refresh Company User Access
export const refreshCompanyAccess = async () => {
  try {
    const response = await apiBase.get('/company/refresh')

    return response.data
  } catch (error) {
      console.error('Error refreshing company access')
  }
}

// Company Login
export const loginCompany = async (email: string, password: string) => {
  try {
    const response = await apiBase.post('/company/login', {
      email,
      password
    })

    return response.data
  } catch (error) {
    console.error('Error logging in company:', error)
    throw error
  }
}

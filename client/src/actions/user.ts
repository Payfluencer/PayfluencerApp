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

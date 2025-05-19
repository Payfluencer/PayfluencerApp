export interface IServerResponse {
  status: 'success' | 'error'
  message: string
  data: Record<string, any> | null
}

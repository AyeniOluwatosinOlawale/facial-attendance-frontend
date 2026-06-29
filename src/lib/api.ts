import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL as string

export const api = axios.create({ baseURL: BASE })

export async function registerEmployee(form: FormData, adminId?: string) {
  if (adminId) form.append('admin_id', adminId)
  const { data } = await api.post('/register', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

function isConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { code?: string; message?: string; response?: unknown }
  if (e.response) return false // got a response — not a connection drop
  return (
    e.code === 'ECONNABORTED' ||
    e.code === 'ERR_NETWORK' ||
    e.code === 'ECONNRESET' ||
    (typeof e.message === 'string' && (
      e.message.includes('Network Error') ||
      e.message.includes('timeout') ||
      e.message.includes('ConnectionTerminated') ||
      e.message.includes('ECONNREFUSED')
    ))
  )
}

export async function clockFace(imageBase64: string, retries = 2): Promise<ClockResponse> {
  try {
    const { data } = await api.post('/clock', { image: imageBase64 }, { timeout: 15000 })
    return data as ClockResponse
  } catch (err) {
    if (retries > 0 && isConnectionError(err)) {
      await new Promise(r => setTimeout(r, 1500))
      return clockFace(imageBase64, retries - 1)
    }
    throw err
  }
}

export interface ClockResponse {
  status: 'no_face' | 'unknown' | 'matched' | 'error'
  action?: 'signed_in' | 'signed_out' | 'already_complete'
  name?: string
  time?: string
  hours_worked?: number
  message?: string
}

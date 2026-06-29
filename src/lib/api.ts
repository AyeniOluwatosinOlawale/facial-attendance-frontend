import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL as string

export const api = axios.create({ baseURL: BASE })

export async function registerEmployee(form: FormData) {
  const { data } = await api.post('/register', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function clockFace(imageBase64: string) {
  const { data } = await api.post('/clock', { image: imageBase64 })
  return data as ClockResponse
}

export interface ClockResponse {
  status: 'no_face' | 'unknown' | 'matched' | 'error'
  action?: 'signed_in' | 'signed_out' | 'already_complete'
  name?: string
  time?: string
  hours_worked?: number
  message?: string
}

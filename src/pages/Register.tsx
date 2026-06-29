import { useRef, useState } from 'react'
import ReactWebcam from 'react-webcam'
import Navbar from '../components/Navbar'
import WebcamCapture from '../components/WebcamCapture'
import { registerEmployee } from '../lib/api'

export default function Register() {
  const webcamRef = useRef<ReactWebcam>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function capture() {
    const screenshot = webcamRef.current?.getScreenshot()
    if (screenshot) setPhoto(screenshot)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!photo) {
      setMessage({ type: 'error', text: 'Please capture a photo before registering.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const blob = await (await fetch(photo)).blob()
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
      const form = new FormData()
      form.append('name', name)
      form.append('email', email)
      form.append('department', department)
      form.append('photo', file)
      await registerEmployee(form)
      setMessage({ type: 'success', text: `${name} has been registered successfully.` })
      setName(''); setEmail(''); setDepartment(''); setPhoto(null)
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-sky-900">Register Employee</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Add a new employee and capture their face so they can clock in automatically.
          </p>
        </div>

        {/* Alert */}
        {message && (
          <div className={`mb-6 flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm border animate-scale-in ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {message.type === 'success'
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></>
              }
            </svg>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Details card */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm animate-fade-in-up [animation-delay:80ms]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-sky-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h2 className="font-semibold text-slate-800 text-sm">Employee Details</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Department
              </label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering, Design, Marketing…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Photo card */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm animate-fade-in-up [animation-delay:160ms]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-sky-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <h2 className="font-semibold text-slate-800 text-sm">Face Photo</h2>
              <span className="ml-auto text-xs text-slate-400">Used for automatic recognition</span>
            </div>

            {photo ? (
              <div className="flex flex-col items-center gap-4 animate-scale-in">
                <div className="relative">
                  <img
                    src={photo}
                    alt="Captured face"
                    className="w-64 h-48 object-cover rounded-xl border-2 border-green-200 shadow-sm"
                  />
                  <div className="absolute top-2 right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-300">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-green-600 font-medium">Photo captured — looks good!</p>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors cursor-pointer flex items-center gap-1.5 hover:underline"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Retake photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl overflow-hidden border-2 border-dashed border-sky-200 transition-colors hover:border-sky-300">
                  <WebcamCapture ref={webcamRef} className="w-64 h-48" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium">Good lighting · Neutral expression · Look straight ahead</p>
                  <p className="text-xs text-slate-400 mt-0.5">Clear photos improve recognition accuracy</p>
                </div>
                <button
                  type="button"
                  onClick={capture}
                  className="flex items-center gap-2 bg-sky-700 hover:bg-sky-600 active:bg-sky-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer hover:shadow-md hover:shadow-sky-200 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  </svg>
                  Capture Photo
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !photo}
            className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold rounded-xl py-3 text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-200 active:scale-[0.99] animate-fade-in-up [animation-delay:240ms]"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Registering…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Register Employee
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

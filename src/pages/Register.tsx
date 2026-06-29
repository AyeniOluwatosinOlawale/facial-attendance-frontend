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

  function retake() {
    setPhoto(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!photo) {
      setMessage({ type: 'error', text: 'Please capture a photo first.' })
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
      setMessage({ type: 'success', text: `${name} registered successfully!` })
      setName('')
      setEmail('')
      setDepartment('')
      setPhoto(null)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Registration failed. Try again.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Register Employee
        </h1>

        {message && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm border ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-700">Employee Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Department
              </label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Photo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-700 mb-4">Face Photo</h2>
            {photo ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={photo}
                  alt="Captured"
                  className="w-64 h-48 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={retake}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Retake photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <WebcamCapture ref={webcamRef} className="w-64 h-48" />
                <button
                  type="button"
                  onClick={capture}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  Capture Photo
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl py-3 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering…' : 'Register Employee'}
          </button>
        </form>
      </div>
    </div>
  )
}

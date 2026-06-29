import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const navigate = useNavigate()

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <span className="font-bold text-indigo-600 text-lg tracking-tight">
        FaceAttend
      </span>
      <div className="flex gap-4 text-sm font-medium text-slate-600">
        <Link to="/clock" className="hover:text-indigo-600 transition-colors">
          Kiosk
        </Link>
        <Link to="/register" className="hover:text-indigo-600 transition-colors">
          Register
        </Link>
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
          Dashboard
        </Link>
        <button
          onClick={signOut}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}

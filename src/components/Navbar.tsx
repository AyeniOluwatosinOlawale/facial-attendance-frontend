import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { to: '/clock', label: 'Kiosk' },
    { to: '/register', label: 'Register' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="border-b border-sky-100 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/clock" className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded-lg bg-sky-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Fira Sans', sans-serif" }} className="font-semibold text-sky-900 tracking-tight text-base">
            FaceAttend
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                location.pathname === to
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-500 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-2" />
          <button
            onClick={signOut}
            className="px-3 py-1.5 rounded-md text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  )
}

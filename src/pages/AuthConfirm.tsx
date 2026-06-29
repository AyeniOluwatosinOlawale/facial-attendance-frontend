import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type State = 'checking' | 'confirmed' | 'error'

export default function AuthConfirm() {
  const [state, setState] = useState<State>('checking')
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Supabase puts the tokens in the URL hash after email confirmation.
    // The client picks them up automatically — we just need to read the session.
    async function check() {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session) {
        setEmail(session.user.email ?? '')
        setState('confirmed')
      } else if (error) {
        setState('error')
      } else {
        // No session yet — wait briefly for the hash to be processed
        setTimeout(async () => {
          const { data: { session: s2 } } = await supabase.auth.getSession()
          if (s2) {
            setEmail(s2.user.email ?? '')
            setState('confirmed')
          } else {
            setState('error')
          }
        }, 1500)
      }
    }
    check()
  }, [])

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-slate-500">Confirming your account…</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Link expired or invalid</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            This confirmation link has expired or already been used. Sign up again to get a fresh one.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Back to sign up
            </Link>
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors">
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center animate-scale-in">

        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-sky-700 flex items-center justify-center shadow-lg shadow-sky-200 mx-auto mb-5 animate-float">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
          </svg>
        </div>

        {/* Checkmark */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Email confirmed!</h2>
        {email && (
          <p className="text-sm text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{email}</span>
          </p>
        )}
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Your admin account is active. Head to your dashboard to register employees and start tracking attendance.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-md hover:shadow-sky-200 active:scale-[0.98]"
        >
          Go to my dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

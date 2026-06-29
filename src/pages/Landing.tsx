import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

const MARQUEE_ITEMS = [
  'Offices', 'Schools', 'Hospitals', 'Factories', 'Hotels',
  'Startups', 'Warehouses', 'Clinics', 'Co-working Spaces',
  'Construction Sites', 'Retail Stores', 'Universities',
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden flex flex-col">

      {/* ── Nav ── */}
      <header className="border-b border-white/5 bg-[#050510]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">FaceAttend</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/features#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/features#faq" className="hover:text-white transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/clock" className="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">
              Live demo →
            </Link>
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-900/50"
            >
              Admin login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-6 w-full">
        <Card className="w-full h-[520px] sm:h-[580px] bg-black/50 border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 rounded-xl border border-indigo-500/20 animate-border-glow pointer-events-none" />
          <Spotlight size={500} className="from-indigo-500/20 via-violet-500/10 to-transparent" />

          <div className="flex h-full flex-col md:flex-row">
            {/* Left copy */}
            <div className="flex-1 p-8 md:p-10 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-1.5 text-xs font-medium text-indigo-300 mb-6 w-fit animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                AI-powered · No badges · No PINs
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] animate-fade-in-up [animation-delay:80ms]">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                  Attendance that runs itself
                </span>
              </h1>

              <p className="mt-5 text-slate-400 max-w-xs leading-relaxed text-sm animate-fade-in-up [animation-delay:160ms]">
                Employees walk up, their face is recognised in under 2 seconds, and their hours are recorded — automatically. No hardware, no app, no paperwork.
              </p>

              <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up [animation-delay:240ms]">
                <Link
                  to="/clock"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-indigo-900/60 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                  Try the live kiosk
                </Link>
                <Link
                  to="/features"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  See features & pricing →
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-8 animate-fade-in-up [animation-delay:320ms]">
                {['Free to start', 'No hardware', 'Setup in 5 min'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 3D scene */}
            <div className="hidden md:block flex-1 relative">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </Card>
      </section>

      {/* ── Marquee ── */}
      <section className="py-5 border-y border-white/5 overflow-hidden bg-white/[0.01]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 text-slate-600 text-sm font-medium tracking-wide uppercase">
              {item}
              <span className="ml-8 text-indigo-800">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Teaser strip ── */}
      <section className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="text-center max-w-xl">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">No friction. No cards. No PINs.</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 leading-tight">
            Face recognition that actually works in a real workplace
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            97%+ accuracy, sub-2-second match time, zero hardware to install. Works on any tablet or laptop already in your office.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/features"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-indigo-900/50 active:scale-95"
            >
              Explore features & pricing
            </Link>
            <Link
              to="/register"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Register first employee
            </Link>
          </div>

          {/* Mini stat row */}
          <div className="flex items-center justify-center gap-8 mt-12 stagger">
            {[
              { value: '<2s', label: 'Recognition time' },
              { value: '97%+', label: 'Accuracy' },
              { value: '0', label: 'Hardware needed' },
            ].map((s) => (
              <div key={s.label} className="animate-fade-in-up text-center">
                <p className="text-2xl font-bold font-mono text-indigo-300">{s.value}</p>
                <p className="text-slate-600 text-xs mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
            </div>
            <span className="text-slate-600 text-xs">FaceAttend — Facial Attendance System</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-700">
            <Link to="/features" className="hover:text-slate-400 transition-colors">Features</Link>
            <Link to="/features#pricing" className="hover:text-slate-400 transition-colors">Pricing</Link>
            <Link to="/clock" className="hover:text-slate-400 transition-colors">Kiosk</Link>
            <Link to="/login" className="hover:text-slate-400 transition-colors">Admin</Link>
          </div>
          <p className="text-slate-800 text-xs">Built with InsightFace · FastAPI · Supabase · React</p>
        </div>
      </footer>
    </div>
  )
}

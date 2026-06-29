import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    title: 'Face Recognition',
    desc: 'Powered by InsightFace AI — identifies employees in under two seconds with 97%+ accuracy.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Automatic Time Tracking',
    desc: 'Sign-in and sign-out are recorded the moment a face is matched. Hours calculated instantly.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Admin Dashboard',
    desc: 'Filter by date, employee, or department. Export CSV reports in one click.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    title: 'Sign-out Reminders',
    desc: 'Automated email alerts when an employee forgets to clock out after 12 hours.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050510] text-white">

      {/* Nav */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">FaceAttend</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/clock" className="text-slate-400 hover:text-white text-sm transition-colors">
              Kiosk
            </Link>
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Admin login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — Spline scene */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <Card className="w-full h-[520px] bg-black/60 border-white/5 relative overflow-hidden">
          <Spotlight size={400} className="from-indigo-500/25 via-purple-500/15 to-transparent" />

          <div className="flex h-full">
            {/* Left — copy */}
            <div className="flex-1 p-10 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs font-medium text-indigo-300 mb-6 w-fit animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                AI-powered attendance
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-up [animation-delay:80ms]">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                  Clock in with<br />just your face
                </span>
              </h1>

              <p className="mt-5 text-slate-400 max-w-sm leading-relaxed text-sm animate-fade-in-up [animation-delay:160ms]">
                No badges, no PINs, no paperwork. Employees walk up to the kiosk and the system takes care of the rest — sign-in, sign-out, and hours worked.
              </p>

              <div className="flex gap-3 mt-8 animate-fade-in-up [animation-delay:240ms]">
                <Link
                  to="/clock"
                  className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-indigo-900/50 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                  Try the kiosk
                </Link>
                <Link
                  to="/login"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  Admin dashboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right — 3D Spline */}
            <div className="flex-1 relative">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest text-center mb-8">
          Everything you need
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {features.map((f) => (
            <div
              key={f.title}
              className="animate-fade-in-up bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/10 rounded-2xl p-5 transition-all group cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500/25 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/5 bg-white/2 py-10 my-4">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '<2s', label: 'Recognition time' },
            { value: '97%+', label: 'Face match accuracy' },
            { value: '24/7', label: 'Kiosk availability' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold font-mono text-indigo-300">{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to go hands-free?</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Walk employees up to the kiosk — they'll be clocked in before they reach their desk.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-indigo-900/50 active:scale-95"
          >
            Register first employee
          </Link>
          <Link
            to="/clock"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            View kiosk demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center">
        <p className="text-slate-700 text-xs">FaceAttend · Built with InsightFace · Supabase · FastAPI</p>
      </footer>
    </div>
  )
}

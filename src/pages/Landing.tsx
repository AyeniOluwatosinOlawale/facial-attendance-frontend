import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

// ── Data ─────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  'Offices', 'Schools', 'Hospitals', 'Factories', 'Hotels',
  'Startups', 'Warehouses', 'Clinics', 'Co-working Spaces',
  'Construction Sites', 'Retail Stores', 'Universities',
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Register employees once',
    desc: 'An admin opens the Register page, fills in the employee\'s name and department, then captures their face photo. Takes under 60 seconds.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Employees walk up to the kiosk',
    desc: 'They tap Sign In or Sign Out on the shared screen. The camera activates, recognises their face in under 2 seconds, and records the time automatically.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Admin reviews reports instantly',
    desc: 'The dashboard shows every sign-in, sign-out, and hours worked — filterable by date, name, or department. Export to CSV in one click.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
]

const FEATURES = [
  {
    title: 'Sub-2-second recognition',
    desc: 'Powered by InsightFace buffalo_sc — one of the fastest face recognition models available. Employees are in and out before they can blink.',
    color: 'from-indigo-500/20 to-violet-500/10',
    border: 'border-indigo-500/20',
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'No hardware required',
    desc: 'Works on any laptop, desktop, or tablet with a camera. Mount a $50 tablet to a wall and you have a permanent kiosk.',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    title: 'Live hours dashboard',
    desc: 'See who is clocked in right now. Hours update live — even mid-session. Overdue sign-outs are flagged automatically.',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Automated email alerts',
    desc: 'Employees who forget to sign out after 12 hours receive an automatic email reminder — no admin action needed.',
    color: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-500/20',
    icon: (
      <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    title: 'CSV export in one click',
    desc: 'Export any date range to a spreadsheet. Payroll-ready: name, department, date, sign-in, sign-out, total hours.',
    color: 'from-sky-500/20 to-cyan-500/10',
    border: 'border-sky-500/20',
    icon: (
      <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    title: 'Secure by design',
    desc: 'Face encodings stored as 128-dimension vectors — not raw photos. Supabase Row Level Security protects all data.',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

const TESTIMONIALS = [
  {
    quote: "We replaced a paper register and a punch-card machine. Setup took one afternoon. Now payroll preparation is automated.",
    name: 'Amara Osei',
    role: 'HR Manager',
    company: 'BuildRight Construction',
    avatar: 'AO',
    color: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    quote: "Our 40-person team clocks in faster than they used to swipe cards. The dashboard tells me everything I need for monthly reports.",
    name: 'Fatima Al-Rashid',
    role: 'Operations Director',
    company: 'NovaCare Clinic',
    avatar: 'FA',
    color: 'bg-indigo-500/20 text-indigo-300',
  },
  {
    quote: "I was sceptical about face recognition accuracy but it has not failed once in three months. Even with different lighting conditions.",
    name: 'Chidi Nwosu',
    role: 'IT Administrator',
    company: 'PeakLogistics Ltd',
    avatar: 'CN',
    color: 'bg-violet-500/20 text-violet-300',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'forever',
    desc: 'Perfect for small teams getting started.',
    features: [
      'Up to 10 employees',
      'Unlimited attendance records',
      'Face recognition kiosk',
      'Basic dashboard',
      'CSV export',
    ],
    cta: 'Get started free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Business',
    price: '$49',
    sub: 'per month',
    desc: 'For growing teams with advanced needs.',
    features: [
      'Unlimited employees',
      'Automated sign-out email alerts',
      'Live hours tracking',
      'Department filtering',
      'Priority support',
      'Custom kiosk branding',
    ],
    cta: 'Start free trial',
    href: '/register',
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    sub: 'contact us',
    desc: 'For large orgs with compliance requirements.',
    features: [
      'Everything in Business',
      'Multi-location kiosks',
      'SSO / SAML',
      'Audit logs',
      'SLA guarantee',
      'Dedicated onboarding',
    ],
    cta: 'Contact sales',
    href: '/login',
    highlight: false,
  },
]

const FAQS = [
  {
    q: 'How accurate is the face recognition?',
    a: 'FaceAttend uses InsightFace buffalo_sc, a production-grade AI model that achieves 97%+ accuracy under standard office lighting. It uses cosine similarity matching — not a basic pixel comparison — so it handles glasses, hair changes, and minor lighting differences well.',
  },
  {
    q: 'Does it work with masks or hats?',
    a: 'Partial face occlusion (hats, beards) is handled well. Full masks covering the nose and mouth will typically not match — this is intentional and prevents impersonation. We recommend employees remove masks briefly at the kiosk.',
  },
  {
    q: 'What happens to the face photos?',
    a: 'Registration photos are used once to generate a 128-number mathematical vector (the face encoding). Only this vector is stored — not the raw photo (unless you enable photo storage for your records). The encoding cannot be reversed into a photo.',
  },
  {
    q: 'What hardware do I need?',
    a: 'Any device with a camera and a modern browser. A cheap Android tablet ($50–$80) wall-mounted works perfectly as a permanent kiosk. No proprietary hardware, no installation fees.',
  },
  {
    q: 'Can employees sign in from their phones?',
    a: 'The kiosk is designed as a shared screen — employees walk up to it, not log in individually. This prevents remote clock-ins and ensures physical presence is recorded.',
  },
  {
    q: 'How is data stored and who can access it?',
    a: 'All data lives in your own Supabase project (PostgreSQL). Admin access is protected by Supabase Auth. Employees have no login — they only interact with the public kiosk.',
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group cursor-pointer"
        aria-expanded={open}
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{q}</span>
        <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-all ${open ? 'bg-indigo-500/20 border-indigo-500/40 rotate-45' : ''}`}>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </button>
      {open && (
        <p className="pb-4 text-sm text-slate-400 leading-relaxed animate-fade-in-up pr-8">{a}</p>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">

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
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-6">
        <Card className="w-full h-[520px] sm:h-[560px] bg-black/50 border-white/5 relative overflow-hidden group">
          {/* Animated border glow */}
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
                  className="group/btn bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-indigo-900/60 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                  Try the live kiosk
                </Link>
                <Link
                  to="/register"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  Register first employee
                </Link>
              </div>

              {/* Trust signals */}
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
              {/* Fade overlay on left edge */}
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

      {/* ── Problem strip ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">Sound familiar?</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 leading-tight">
          Manual attendance is costing you<br className="hidden sm:block" /> time, money, and accuracy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {[
            { icon: '📋', title: 'Paper registers get lost', desc: 'Or filled in incorrectly. Or not at all. Reconstructing attendance from memory is a nightmare.' },
            { icon: '🕐', title: 'Time theft adds up', desc: 'Buddy punching — clocking in for a colleague — costs businesses 2–8% of their payroll annually.' },
            { icon: '📊', title: 'Reporting takes hours', desc: 'Manually totalling hours from spreadsheets every month is error-prone and wastes your HR team.' },
          ].map((p) => (
            <div key={p.title} className="animate-fade-in-up bg-red-500/5 border border-red-500/10 rounded-2xl p-5 text-left">
              <div className="text-2xl mb-3">{p.icon}</div>
              <h3 className="font-semibold text-slate-200 mb-1.5 text-sm">{p.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Simple by design</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Three steps. That's the entire workflow.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="animate-fade-in-up relative">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(100%+0px)] w-full h-px bg-gradient-to-r from-indigo-500/30 to-transparent z-10 pointer-events-none" style={{ width: 'calc(100% - 2rem)' }} />
                )}
                <div className="bg-white/3 hover:bg-white/5 border border-white/8 hover:border-indigo-500/20 rounded-2xl p-6 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/25 transition-colors">
                      {step.icon}
                    </div>
                    <span className="text-2xl font-bold text-white/10 font-mono">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Live demo CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/clock"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-indigo-900/50 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
              See step 2 live — open the kiosk
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Everything included</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Built for real workplaces, not demos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`animate-fade-in-up bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200 cursor-default`}
              >
                <div className="w-9 h-9 rounded-xl bg-black/30 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center stagger">
            {[
              { value: '<2s', label: 'Face match time' },
              { value: '97%+', label: 'Accuracy rate' },
              { value: '0', label: 'Hardware needed' },
              { value: '5min', label: 'Setup time' },
            ].map((s) => (
              <div key={s.label} className="animate-fade-in-up">
                <p className="text-3xl sm:text-4xl font-bold font-mono text-indigo-300 mb-1">{s.value}</p>
                <p className="text-slate-600 text-xs tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Trusted by teams</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">From day one to day three hundred</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="animate-fade-in-up bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/15 transition-colors">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Simple pricing</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Start free. Scale when you're ready.</h2>
            <p className="text-slate-500 text-sm mt-3">No contracts. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`animate-fade-in-up rounded-2xl p-6 flex flex-col relative ${
                  plan.highlight
                    ? 'bg-indigo-600/15 border-2 border-indigo-500/60 shadow-xl shadow-indigo-900/30'
                    : 'bg-white/3 border border-white/8'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-3xl font-bold text-white font-mono">{plan.price}</span>
                    <span className="text-slate-500 text-xs mb-1">/ {plan.sub}</span>
                  </div>
                  <p className="text-slate-500 text-xs">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.href}
                  className={`w-full text-center font-semibold py-2.5 rounded-xl text-sm transition-all ${
                    plan.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-900/50'
                      : 'bg-white/8 hover:bg-white/12 text-slate-200 border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Got questions?</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Answers to the obvious ones</h2>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl px-6 divide-y-0">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Live demo available right now
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Ready to put attendance on autopilot?
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
            Register your first employee in under a minute, open the kiosk, and watch the attendance record appear in real time.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-indigo-900/60 active:scale-95"
            >
              Get started — it's free
            </Link>
            <Link
              to="/clock"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold px-7 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
              Open live kiosk
            </Link>
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
            <Link to="/clock" className="hover:text-slate-400 transition-colors">Kiosk</Link>
            <Link to="/register" className="hover:text-slate-400 transition-colors">Register</Link>
            <Link to="/dashboard" className="hover:text-slate-400 transition-colors">Dashboard</Link>
            <Link to="/login" className="hover:text-slate-400 transition-colors">Admin</Link>
          </div>
          <p className="text-slate-800 text-xs">Built with InsightFace · FastAPI · Supabase · React</p>
        </div>
      </footer>
    </div>
  )
}

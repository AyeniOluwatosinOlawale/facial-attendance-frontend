import { format } from 'date-fns'
import type { ClockResponse } from '../lib/api'

function formatHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return `${hrs}h ${mins}m`
}

function ResultCard({
  icon,
  title,
  subtitle,
  note,
  color,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: React.ReactNode
  note?: string
  color: 'green' | 'blue' | 'red' | 'slate' | 'yellow'
}) {
  const ring = {
    green:  'ring-green-500/30 bg-green-500/10',
    blue:   'ring-blue-500/30 bg-blue-500/10',
    red:    'ring-red-500/30 bg-red-500/10',
    slate:  'ring-slate-500/30 bg-slate-500/10',
    yellow: 'ring-yellow-500/30 bg-yellow-500/10',
  }[color]

  const titleColor = {
    green:  'text-green-300',
    blue:   'text-blue-300',
    red:    'text-red-300',
    slate:  'text-slate-300',
    yellow: 'text-yellow-300',
  }[color]

  const iconBg = {
    green:  'bg-green-500/20 text-green-400',
    blue:   'bg-blue-500/20 text-blue-400',
    red:    'bg-red-500/20 text-red-400',
    slate:  'bg-slate-500/20 text-slate-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
  }[color]

  return (
    <div className={`w-full rounded-2xl backdrop-blur ring-1 ${ring} px-8 py-6 text-center animate-fade-in-up`}>
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${titleColor}`}>{title}</p>
      {subtitle && <div className="text-slate-300 mt-2 text-sm">{subtitle}</div>}
      {note && <p className="text-slate-500 text-xs mt-2">{note}</p>}
    </div>
  )
}

export default function ClockResult({ result }: { result: ClockResponse }) {
  if (result.status === 'error') {
    return (
      <ResultCard
        color="yellow"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.95 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        }
        title="Connection error"
        subtitle={result.message ?? 'Could not reach the recognition server'}
        note="Retrying automatically…"
      />
    )
  }

  if (result.status === 'no_face') {
    return (
      <ResultCard
        color="slate"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        }
        title="No face detected"
        subtitle="Move closer and face the camera directly"
        note="Ensure good lighting"
      />
    )
  }

  if (result.status === 'unknown') {
    return (
      <ResultCard
        color="red"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        }
        title="Face not recognized"
        subtitle="Not registered in the system"
        note="Please see an admin to register"
      />
    )
  }

  if (result.action === 'signed_in') {
    return (
      <ResultCard
        color="green"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title={`Welcome, ${result.name}!`}
        subtitle={
          <>
            Signed in at{' '}
            <span className="font-bold text-green-300 font-mono">
              {result.time ? format(new Date(result.time), 'hh:mm a') : '—'}
            </span>
          </>
        }
        note="Have a productive day"
      />
    )
  }

  if (result.action === 'signed_out') {
    return (
      <ResultCard
        color="blue"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6A2.25 2.25 0 0118.75 5.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
          </svg>
        }
        title={`Goodbye, ${result.name}!`}
        subtitle={
          <>
            Today:{' '}
            <span className="font-bold text-blue-300 font-mono text-lg">
              {result.hours_worked != null ? formatHours(result.hours_worked) : '—'}
            </span>
          </>
        }
        note="See you tomorrow"
      />
    )
  }

  if (result.action === 'already_complete') {
    return (
      <ResultCard
        color="slate"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Already done today"
        subtitle={
          <>
            {result.name} ·{' '}
            <span className="font-mono">
              {result.hours_worked != null ? formatHours(result.hours_worked) : '—'}
            </span>{' '}
            worked
          </>
        }
        note="Full day recorded"
      />
    )
  }

  return null
}

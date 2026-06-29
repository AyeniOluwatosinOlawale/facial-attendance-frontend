import { format } from 'date-fns'
import type { ClockResponse } from '../lib/api'

function formatHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return `${hrs}h ${mins}m`
}

export default function ClockResult({ result }: { result: ClockResponse }) {
  if (result.status === 'error') {
    return (
      <div className="rounded-2xl bg-yellow-50 border border-yellow-200 px-8 py-6 text-center">
        <p className="text-2xl font-semibold text-yellow-700">Connection error</p>
        <p className="text-yellow-600 mt-1 text-sm">{result.message ?? 'Could not reach the recognition server. Retrying…'}</p>
      </div>
    )
  }

  if (result.status === 'no_face') {
    return (
      <div className="rounded-2xl bg-slate-100 border border-slate-200 px-8 py-6 text-center">
        <p className="text-2xl font-semibold text-slate-500">
          Stand closer to the camera
        </p>
        <p className="text-slate-400 mt-1 text-sm">No face detected</p>
      </div>
    )
  }

  if (result.status === 'unknown') {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 px-8 py-6 text-center">
        <p className="text-2xl font-semibold text-red-600">
          Face not recognized
        </p>
        <p className="text-red-400 mt-1 text-sm">
          Please register first or try again
        </p>
      </div>
    )
  }

  if (result.action === 'signed_in') {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 px-8 py-6 text-center">
        <p className="text-3xl font-bold text-green-700">
          Welcome, {result.name}!
        </p>
        <p className="text-green-600 mt-2">
          Signed in at{' '}
          <span className="font-semibold">
            {result.time ? format(new Date(result.time), 'hh:mm a') : '—'}
          </span>
        </p>
        <p className="text-green-400 text-sm mt-1">Have a productive day</p>
      </div>
    )
  }

  if (result.action === 'signed_out') {
    return (
      <div className="rounded-2xl bg-blue-50 border border-blue-200 px-8 py-6 text-center">
        <p className="text-3xl font-bold text-blue-700">
          Goodbye, {result.name}!
        </p>
        <p className="text-blue-600 mt-2">
          Hours worked today:{' '}
          <span className="font-semibold">
            {result.hours_worked != null ? formatHours(result.hours_worked) : '—'}
          </span>
        </p>
        <p className="text-blue-400 text-sm mt-1">See you tomorrow</p>
      </div>
    )
  }

  if (result.action === 'already_complete') {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 px-8 py-6 text-center">
        <p className="text-2xl font-semibold text-slate-600">
          {result.name} — already done for today
        </p>
        <p className="text-slate-400 mt-1">
          Total: {result.hours_worked != null ? formatHours(result.hours_worked) : '—'}
        </p>
      </div>
    )
  }

  return null
}

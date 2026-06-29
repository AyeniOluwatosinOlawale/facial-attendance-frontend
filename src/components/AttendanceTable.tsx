import { format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'

interface Row {
  id: string
  date: string
  check_in: string | null
  check_out: string | null
  hours_worked: number | null
  alert_sent: boolean
  status: string
  employees: { name: string; department: string; email: string }
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return format(parseISO(iso), 'hh:mm a')
}

function fmtHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return `${hrs}h ${mins}m`
}

function elapsedHours(checkIn: string) {
  return (Date.now() - new Date(checkIn).getTime()) / 3600000
}

function isOverdue(row: Row) {
  if (row.check_out || !row.check_in) return false
  return elapsedHours(row.check_in) >= 12
}

function LiveHours({ checkIn }: { checkIn: string }) {
  const [hours, setHours] = useState(elapsedHours(checkIn))
  useEffect(() => {
    const id = setInterval(() => setHours(elapsedHours(checkIn)), 30000)
    return () => clearInterval(id)
  }, [checkIn])
  return (
    <span className="font-mono text-amber-700 font-semibold">
      {fmtHours(hours)}
      <span className="text-xs font-normal text-amber-400 ml-1">live</span>
    </span>
  )
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'bg-sky-200 text-sky-800',
  'bg-violet-200 text-violet-800',
  'bg-green-200 text-green-800',
  'bg-rose-200 text-rose-800',
  'bg-amber-200 text-amber-800',
  'bg-teal-200 text-teal-800',
]

function avatarColor(name: string) {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function AttendanceTable({ rows }: { rows: Row[] }) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No records found</p>
        <p className="text-slate-400 text-sm mt-1">Try adjusting the date range or name filter</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sky-50 text-left">
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sign In</th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sign Out</th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Hours</th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const overdue = isOverdue(row)
            const inProgress = !row.check_out && !!row.check_in
            return (
              <tr
                key={row.id}
                className={`border-b border-slate-50 last:border-0 transition-colors hover:bg-sky-50/50 ${
                  overdue ? 'bg-amber-50/60' : ''
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${avatarColor(row.employees.name)} flex items-center justify-center text-xs font-bold shrink-0`}>
                      {initials(row.employees.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 leading-tight">{row.employees.name}</p>
                      <p className="text-xs text-slate-400">{row.employees.department || 'No dept.'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{row.date}</td>
                <td className="px-5 py-3.5 text-slate-700 font-mono text-xs">
                  {row.check_in ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {fmt(row.check_in)}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-5 py-3.5">
                  {inProgress ? (
                    <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      In progress
                    </span>
                  ) : (
                    <span className="text-slate-700 font-mono text-xs flex items-center gap-1.5">
                      {row.check_out && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                      {fmt(row.check_out)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-medium">
                  {row.hours_worked != null
                    ? <span className="font-mono text-slate-800 text-xs">{fmtHours(row.hours_worked)}</span>
                    : inProgress && row.check_in
                    ? <LiveHours checkIn={row.check_in} />
                    : <span className="text-slate-300">—</span>
                  }
                </td>
                <td className="px-5 py-3.5">
                  {overdue ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.95 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Overdue
                    </span>
                  ) : inProgress ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      row.status === 'present'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.status}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

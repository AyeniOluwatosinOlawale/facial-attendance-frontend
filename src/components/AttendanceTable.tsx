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
    <span className="text-amber-600 font-medium">
      {fmtHours(hours)} <span className="text-xs font-normal text-amber-400">(live)</span>
    </span>
  )
}

export default function AttendanceTable({ rows }: { rows: Row[] }) {
  if (!rows.length) {
    return (
      <p className="text-center text-slate-400 py-12">
        No attendance records found.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500 bg-slate-50">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Sign In</th>
            <th className="px-4 py-3 font-medium">Sign Out</th>
            <th className="px-4 py-3 font-medium">Hours</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const overdue = isOverdue(row)
            const inProgress = !row.check_out && !!row.check_in
            return (
              <tr
                key={row.id}
                className={`border-b border-slate-100 last:border-0 ${
                  overdue ? 'bg-orange-50' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {row.employees.name}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {row.employees.department || '—'}
                </td>
                <td className="px-4 py-3 text-slate-500">{row.date}</td>
                <td className="px-4 py-3">{fmt(row.check_in)}</td>
                <td className="px-4 py-3">
                  {inProgress ? (
                    <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      In progress
                    </span>
                  ) : (
                    fmt(row.check_out)
                  )}
                </td>
                <td className="px-4 py-3 font-medium">
                  {row.hours_worked != null
                    ? fmtHours(row.hours_worked)
                    : inProgress && row.check_in
                    ? <LiveHours checkIn={row.check_in} />
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  {overdue ? (
                    <span className="inline-flex items-center gap-1 text-orange-600 font-medium text-xs">
                      ⚠ Forgot to sign out
                    </span>
                  ) : inProgress ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      Signed in
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      row.status === 'present'
                        ? 'bg-green-100 text-green-700'
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

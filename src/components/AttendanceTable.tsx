import { format, parseISO } from 'date-fns'

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

function fmtHours(h: number | null) {
  if (h == null) return '—'
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return `${hrs}h ${mins}m`
}

function isOverdue(row: Row) {
  if (row.check_out) return false
  if (!row.check_in) return false
  const elapsed = (Date.now() - new Date(row.check_in).getTime()) / 3600000
  return elapsed >= 12
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
                <td className="px-4 py-3">{fmt(row.check_out)}</td>
                <td className="px-4 py-3 font-medium">
                  {fmtHours(row.hours_worked)}
                </td>
                <td className="px-4 py-3">
                  {overdue ? (
                    <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                      ⚠ Forgot to sign out
                    </span>
                  ) : (
                    <span
                      className={`capitalize ${
                        row.status === 'present'
                          ? 'text-green-600'
                          : 'text-slate-400'
                      }`}
                    >
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

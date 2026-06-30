import { useEffect, useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import Navbar from '../components/Navbar'
import AttendanceTable from '../components/AttendanceTable'
import { supabase } from '../lib/supabase'

interface AttendanceRow {
  id: string
  date: string
  check_in: string | null
  check_out: string | null
  hours_worked: number | null
  alert_sent: boolean
  status: string
  employees: { name: string; department: string; email: string }
}

interface Summary {
  name: string
  department: string
  total_hours: number
  days: number
  inProgress: boolean
}

function fmtH(h: number) {
  return `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`
}

function toCSV(rows: AttendanceRow[]) {
  const header = 'Name,Department,Date,Sign In,Sign Out,Hours,Status'
  const lines = rows.map((r) =>
    [
      r.employees.name,
      r.employees.department,
      r.date,
      r.check_in ? format(new Date(r.check_in), 'hh:mm a') : '',
      r.check_out ? format(new Date(r.check_out), 'hh:mm a') : '',
      r.hours_worked ?? '',
      r.status,
    ].join(',')
  )
  return [header, ...lines].join('\n')
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent: 'sky' | 'green' | 'amber' | 'slate'
}) {
  const bg = { sky: 'bg-sky-50', green: 'bg-green-50', amber: 'bg-amber-50', slate: 'bg-slate-50' }[accent]
  // each card picks up stagger delay from parent .stagger class
  const iconBg = { sky: 'bg-sky-100 text-sky-700', green: 'bg-green-100 text-green-700', amber: 'bg-amber-100 text-amber-700', slate: 'bg-slate-100 text-slate-600' }[accent]
  const val = { sky: 'text-sky-900', green: 'text-green-800', amber: 'text-amber-800', slate: 'text-slate-800' }[accent]

  return (
    <div className={`${bg} rounded-2xl border border-sky-100 p-5 flex items-center gap-4 animate-fade-in-up`}>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-xl font-bold ${val} mt-0.5 font-mono`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [nameFilter, setNameFilter] = useState('')
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 6), 'yyyy-MM-dd'))
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    async function load() {
      setLoading(true)

      // Get current admin's user ID so we only show their employees
      const { data: { session } } = await supabase.auth.getSession()
      const adminId = session?.user?.id

      // Get employee IDs belonging to this admin (or with no admin set — legacy records)
      const { data: myEmployees } = await supabase
        .from('employees')
        .select('id')
        .or(`admin_id.eq.${adminId},admin_id.is.null`)

      const empIds = (myEmployees ?? []).map((e: { id: string }) => e.id)

      if (empIds.length === 0) {
        setRows([])
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('attendance')
        .select('id, date, check_in, check_out, hours_worked, alert_sent, status, employees(name, department, email)')
        .in('employee_id', empIds)
        .gte('date', dateFrom)
        .lte('date', dateTo)
        .order('date', { ascending: false })
        .order('check_in', { ascending: false })

      setRows((data as unknown as AttendanceRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [dateFrom, dateTo])

  const filtered = useMemo(
    () => nameFilter ? rows.filter((r) => r.employees.name.toLowerCase().includes(nameFilter.toLowerCase())) : rows,
    [rows, nameFilter]
  )

  const summaries = useMemo<Summary[]>(() => {
    const map = new Map<string, { hours: number; days: Set<string>; dept: string; inProgress: boolean }>()
    for (const r of filtered) {
      const prev = map.get(r.employees.name) ?? { hours: 0, days: new Set(), dept: r.employees.department, inProgress: false }
      let hours = r.hours_worked ?? 0
      let inProgress = false
      if (r.hours_worked == null && r.check_in && !r.check_out) {
        hours = (Date.now() - new Date(r.check_in).getTime()) / 3600000
        inProgress = true
      }
      prev.hours += hours
      prev.days.add(r.date)
      prev.inProgress = prev.inProgress || inProgress
      map.set(r.employees.name, prev)
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, department: v.dept, total_hours: v.hours, days: v.days.size, inProgress: v.inProgress }))
      .sort((a, b) => b.total_hours - a.total_hours)
  }, [filtered])

  const totalPresent = useMemo(() => new Set(filtered.map((r) => r.employees.email)).size, [filtered])
  const inProgressCount = useMemo(() => filtered.filter((r) => r.check_in && !r.check_out).length, [filtered])
  const overdueCount = useMemo(
    () => filtered.filter((r) => r.check_in && !r.check_out && (Date.now() - new Date(r.check_in).getTime()) / 3600000 >= 12).length,
    [filtered]
  )

  function downloadCSV() {
    const blob = new Blob([toCSV(filtered)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${dateFrom}-to-${dateTo}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-sky-900">Attendance Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              {format(new Date(dateFrom), 'MMM d')} – {format(new Date(dateTo), 'MMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger">
          <StatCard
            label="Employees"
            value={String(totalPresent)}
            sub="in selected range"
            accent="sky"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
          />
          <StatCard
            label="Records"
            value={String(filtered.length)}
            sub="total sessions"
            accent="slate"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            }
          />
          <StatCard
            label="Active now"
            value={String(inProgressCount)}
            sub="currently signed in"
            accent="green"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Overdue"
            value={String(overdueCount)}
            sub=">12h without sign-out"
            accent="amber"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.95 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            }
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm animate-fade-in-up [animation-delay:280ms]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-sky-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
            </div>
            <h2 className="font-semibold text-slate-800 text-sm">Filters</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Employee</label>
              <input
                placeholder="Filter by name…"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Hours summary cards */}
        {summaries.length > 0 && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-sky-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h2 className="font-semibold text-slate-800 text-sm">Hours summary</h2>
              <span className="text-xs text-slate-400 ml-1">selected period</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {summaries.map((s) => (
                <div key={s.name} className="bg-sky-50 border border-sky-100 rounded-xl px-5 py-3 min-w-[140px]">
                  <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                  {s.department && <p className="text-xs text-slate-400 mb-1">{s.department}</p>}
                  <p className={`text-2xl font-bold font-mono mt-1 ${s.inProgress ? 'text-amber-600' : 'text-sky-700'}`}>
                    {fmtH(s.total_hours)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.days} day{s.days !== 1 ? 's' : ''}{s.inProgress ? ' · live' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-sky-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-sky-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5 0H11.25m0-3.75" />
                </svg>
              </div>
              <h2 className="font-semibold text-slate-800 text-sm">Records</h2>
              <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-2.5 w-20 rounded" />
                  </div>
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-3 w-12 rounded" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <AttendanceTable rows={filtered} />
          )}
        </div>

      </div>
    </div>
  )
}

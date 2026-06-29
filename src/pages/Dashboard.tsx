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
  total_hours: number
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

export default function Dashboard() {
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [nameFilter, setNameFilter] = useState('')
  const [dateFrom, setDateFrom] = useState(
    format(subDays(new Date(), 6), 'yyyy-MM-dd')
  )
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('attendance')
        .select(
          'id, date, check_in, check_out, hours_worked, alert_sent, status, employees(name, department, email)'
        )
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
    () =>
      nameFilter
        ? rows.filter((r) =>
            r.employees.name.toLowerCase().includes(nameFilter.toLowerCase())
          )
        : rows,
    [rows, nameFilter]
  )

  const summaries = useMemo<Summary[]>(() => {
    const map = new Map<string, number>()
    for (const r of filtered) {
      const prev = map.get(r.employees.name) ?? 0
      map.set(r.employees.name, prev + (r.hours_worked ?? 0))
    }
    return Array.from(map.entries())
      .map(([name, total_hours]) => ({ name, total_hours }))
      .sort((a, b) => b.total_hours - a.total_hours)
  }, [filtered])

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Attendance Dashboard
          </h1>
          <button
            onClick={downloadCSV}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Employee name
            </label>
            <input
              placeholder="Filter by name…"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Hours summary */}
        {summaries.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Total hours (selected period)
            </h2>
            <div className="flex flex-wrap gap-3">
              {summaries.map((s) => (
                <div
                  key={s.name}
                  className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm"
                >
                  <p className="font-semibold text-slate-700">{s.name}</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">
                    {fmtH(s.total_hours)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-center text-slate-400 py-12">Loading…</p>
        ) : (
          <AttendanceTable rows={filtered} />
        )}
      </div>
    </div>
  )
}

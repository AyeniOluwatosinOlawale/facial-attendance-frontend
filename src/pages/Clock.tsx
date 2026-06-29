import { useCallback, useEffect, useRef, useState } from 'react'
import ReactWebcam from 'react-webcam'
import WebcamCapture from '../components/WebcamCapture'
import ClockResult from '../components/ClockResult'
import { clockFace, type ClockResponse } from '../lib/api'

const POLL_INTERVAL_MS = 2000
const RESULT_PAUSE_MS = 5000

type Mode = 'sign_in' | 'sign_out' | null

function isConnectionMsg(msg: string) {
  return (
    msg.includes('ConnectionTerminated') ||
    msg.includes('Network Error') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ECONNRESET') ||
    msg.includes('timeout') ||
    msg.includes('API unreachable')
  )
}

export default function Clock() {
  const webcamRef = useRef<ReactWebcam>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [result, setResult] = useState<ClockResponse | null>(null)
  const [scanning, setScanning] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const [time, setTime] = useState(new Date())
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot) return
    try {
      const res = await clockFace(screenshot)
      if (res.status === 'matched') {
        setResult(res)
        setScanning(false)
        pauseTimerRef.current = setTimeout(() => {
          setResult(null)
          setMode(null)
          setScanning(false)
        }, RESULT_PAUSE_MS)
      } else {
        setResult(res)
      }
    } catch (err: unknown) {
      let message = 'API unreachable'
      if (err && typeof err === 'object' && 'response' in err) {
        const axErr = err as { response?: { data?: { detail?: string }; status?: number } }
        message = axErr.response?.data?.detail ?? `HTTP ${axErr.response?.status}`
      } else if (err instanceof Error) {
        message = err.message
      }
      if (isConnectionMsg(message)) {
        setReconnecting(true)
        setResult(null)
        setTimeout(() => setReconnecting(false), 4000)
      } else {
        setReconnecting(false)
        setResult({ status: 'error', message } as ClockResponse)
      }
    }
  }, [])

  useEffect(() => {
    if (!scanning) return
    const id = setInterval(capture, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [scanning, capture])

  useEffect(() => () => { if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current) }, [])

  function startMode(selected: Mode) {
    setMode(selected)
    setResult(null)
    setScanning(true)
  }

  function cancel() {
    setMode(null)
    setResult(null)
    setScanning(false)
    setReconnecting(false)
  }

  const TZ = 'Africa/Lagos'
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en', { timeZone: TZ, ...opts }).format(time)

  const weekday = fmt({ weekday: 'short' })
  const month   = fmt({ month: 'short' })
  const day     = fmt({ day: '2-digit' })
  const hh      = fmt({ hour: '2-digit', hour12: false }).padStart(2, '0')
  const mm      = fmt({ minute: '2-digit' }).padStart(2, '0')
  const ss      = String(time.getSeconds()).padStart(2, '0')
  const year    = fmt({ year: 'numeric' })
  const clockStr = `${weekday} ${month} ${day} ${hh}:${mm}:${ss} WAT ${year}`

  const hours = parseInt(hh)
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center gap-8 p-6 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] bg-indigo-700/8 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-3xl animate-spin-slow [animation-direction:reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-900/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative text-center flex flex-col items-center gap-2 animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">FaceAttend</span>
        </div>

        {/* Live clock */}
        <p className="font-mono text-white text-xl font-semibold tabular-nums tracking-tight">
          {clockStr}
        </p>
      </div>

      {/* ── Mode selection ── */}
      {mode === null && (
        <div className="relative flex flex-col items-center gap-5 w-full max-w-xs animate-fade-in-up [animation-delay:100ms]">
          <div className="text-center">
            <p className="text-white font-semibold text-lg">{greeting}!</p>
            <p className="text-slate-400 text-sm mt-0.5">Tap below to record your attendance</p>
          </div>

          <div className="flex flex-col gap-3 w-full stagger">
            <button
              onClick={() => startMode('sign_in')}
              className="animate-fade-in-up group w-full relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold py-6 rounded-2xl transition-all duration-200 shadow-xl shadow-green-900/30 active:scale-95 hover:shadow-2xl hover:shadow-green-900/40"
            >
              <span className="relative flex items-center justify-center gap-3 text-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
                </svg>
                Sign In
              </span>
              <p className="text-green-200/70 text-xs font-normal mt-0.5">Start your work session</p>
              {/* Shine sweep */}
              <div className="absolute inset-0 bg-white/6 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12 pointer-events-none" />
            </button>

            <button
              onClick={() => startMode('sign_out')}
              className="animate-fade-in-up group w-full relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold py-6 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-900/30 active:scale-95 hover:shadow-2xl hover:shadow-blue-900/40"
            >
              <span className="relative flex items-center justify-center gap-3 text-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6A2.25 2.25 0 0118.75 5.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
                </svg>
                Sign Out
              </span>
              <p className="text-blue-200/70 text-xs font-normal mt-0.5">End your work session</p>
              <div className="absolute inset-0 bg-white/6 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12 pointer-events-none" />
            </button>
          </div>

          <a
            href="/login"
            className="text-slate-600 text-xs hover:text-slate-400 transition-colors flex items-center gap-1 mt-1 animate-fade-in-up [animation-delay:320ms]"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
            </svg>
            Admin login
          </a>
        </div>
      )}

      {/* ── Camera view ── */}
      {mode !== null && (
        <>
          {/* Mode pill */}
          <div className="animate-slide-down">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ring-1 ${
              mode === 'sign_in'
                ? 'bg-green-500/15 text-green-300 ring-green-500/30'
                : 'bg-blue-500/15 text-blue-300 ring-blue-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${mode === 'sign_in' ? 'bg-green-400' : 'bg-blue-400'}`} />
              {mode === 'sign_in' ? 'Signing in — hold still' : 'Signing out — hold still'}
            </span>
          </div>

          {/* Webcam */}
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/50 animate-scale-in">
            <WebcamCapture ref={webcamRef} className="w-[460px] h-[345px]" />

            {/* Scan overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Outer spinning ring */}
                <div className={`absolute w-48 h-48 rounded-full border-2 border-dashed opacity-50 animate-spin [animation-duration:3s] ${
                  mode === 'sign_in' ? 'border-green-400' : 'border-blue-400'
                }`} />
                {/* Inner pulsing ring */}
                <div className={`absolute w-32 h-32 rounded-full border-2 animate-scan ${
                  mode === 'sign_in' ? 'border-green-300/60' : 'border-blue-300/60'
                }`} />
                {/* Corner guides */}
                <div className="absolute inset-8 pointer-events-none">
                  <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg ${mode === 'sign_in' ? 'border-green-400' : 'border-blue-400'}`} />
                  <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg ${mode === 'sign_in' ? 'border-green-400' : 'border-blue-400'}`} />
                  <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg ${mode === 'sign_in' ? 'border-green-400' : 'border-blue-400'}`} />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg ${mode === 'sign_in' ? 'border-green-400' : 'border-blue-400'}`} />
                </div>
              </div>
            )}

            {/* Bottom hint */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4">
              <p className="text-white/60 text-xs text-center font-medium tracking-wide">
                Centre your face · Look straight ahead
              </p>
            </div>
          </div>

          {/* Status / result */}
          <div className="w-full max-w-sm">
            {reconnecting ? (
              <div className="rounded-2xl bg-amber-500/10 backdrop-blur ring-1 ring-amber-400/20 px-8 py-5 text-center animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-amber-300 text-sm font-medium">Reconnecting…</p>
                </div>
                <p className="text-amber-400/60 text-xs">Server is waking up, please hold still</p>
              </div>
            ) : result ? (
              <ClockResult result={result} />
            ) : (
              <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 px-8 py-5 text-center animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <p className="text-slate-200 text-sm font-medium">Recognizing your face…</p>
                </div>
                <p className="text-slate-500 text-xs">This usually takes 1–2 seconds</p>
              </div>
            )}
          </div>

          {/* Back button */}
          <button
            onClick={cancel}
            className="flex items-center gap-1.5 text-slate-600 text-sm hover:text-slate-300 transition-colors group animate-fade-in-up [animation-delay:200ms]"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to menu
          </button>
        </>
      )}
    </div>
  )
}

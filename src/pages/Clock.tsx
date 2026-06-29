import { useCallback, useEffect, useRef, useState } from 'react'
import ReactWebcam from 'react-webcam'
import WebcamCapture from '../components/WebcamCapture'
import ClockResult from '../components/ClockResult'
import { clockFace, type ClockResponse } from '../lib/api'

const POLL_INTERVAL_MS = 2000
const RESULT_PAUSE_MS = 5000

type Mode = 'sign_in' | 'sign_out' | null

function Clock24Icon() {
  return (
    <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  )
}

export default function Clock() {
  const webcamRef = useRef<ReactWebcam>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [result, setResult] = useState<ClockResponse | null>(null)
  const [scanning, setScanning] = useState(false)
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
    } catch (err) {
      setResult({ status: 'error', message: err instanceof Error ? err.message : 'API unreachable — check connection' } as ClockResponse)
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
  }

  const clockStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center gap-8 p-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 mb-1">
          <Clock24Icon />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">FaceAttend</h1>
        </div>
        <p className="text-2xl font-mono font-bold text-indigo-300">{clockStr}</p>
        <p className="text-slate-400 text-sm">{dateStr}</p>
      </div>

      {/* Mode selection */}
      {mode === null && (
        <div className="relative flex flex-col items-center gap-6 w-full max-w-sm">
          <p className="text-slate-300 text-base font-medium tracking-wide uppercase text-xs">
            Choose an option to continue
          </p>
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={() => startMode('sign_in')}
              className="group w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-xl font-bold py-7 rounded-2xl transition-all duration-200 shadow-xl shadow-green-900/40 active:scale-95"
            >
              <span className="relative flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
                </svg>
                Sign In
              </span>
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </button>

            <button
              onClick={() => startMode('sign_out')}
              className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white text-xl font-bold py-7 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-900/40 active:scale-95"
            >
              <span className="relative flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6A2.25 2.25 0 0118.75 5.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
                </svg>
                Sign Out
              </span>
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </button>
          </div>

          <a href="/login" className="text-slate-600 text-xs hover:text-slate-400 transition-colors mt-2">
            Admin login →
          </a>
        </div>
      )}

      {/* Camera view */}
      {mode !== null && (
        <>
          <div className="relative flex flex-col items-center gap-1">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-2 ${
              mode === 'sign_in'
                ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/40'
                : 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${mode === 'sign_in' ? 'bg-green-400' : 'bg-blue-400'}`} />
              {mode === 'sign_in' ? 'Sign In Mode' : 'Sign Out Mode'}
            </span>
          </div>

          <div className="relative rounded-3xl overflow-hidden ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-900/40">
            <WebcamCapture ref={webcamRef} className="w-[480px] h-[360px]" />
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-52 border-4 border-indigo-400/70 border-dashed rounded-full animate-spin" />
                <div className="absolute w-40 h-40 border-2 border-indigo-300/30 rounded-full" />
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-4">
              <p className="text-white/70 text-xs text-center">Position your face in the frame</p>
            </div>
          </div>

          <div className="w-full max-w-md">
            {result ? (
              <ClockResult result={result} />
            ) : (
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-8 py-5 text-center">
                <p className="text-slate-300 text-base">Scanning for your face…</p>
                <p className="text-slate-500 text-sm mt-1">Stay still and look directly at the camera</p>
              </div>
            )}
          </div>

          <button
            onClick={cancel}
            className="flex items-center gap-1.5 text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to menu
          </button>
        </>
      )}
    </div>
  )
}

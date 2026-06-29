import { useCallback, useEffect, useRef, useState } from 'react'
import ReactWebcam from 'react-webcam'
import WebcamCapture from '../components/WebcamCapture'
import ClockResult from '../components/ClockResult'
import { clockFace, type ClockResponse } from '../lib/api'

const POLL_INTERVAL_MS = 2000
const RESULT_PAUSE_MS = 5000

export default function Clock() {
  const webcamRef = useRef<ReactWebcam>(null)
  const [result, setResult] = useState<ClockResponse | null>(null)
  const [scanning, setScanning] = useState(true)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
          setScanning(true)
        }, RESULT_PAUSE_MS)
      } else {
        setResult(res)
      }
    } catch {
      // network error — keep scanning silently
    }
  }, [])

  useEffect(() => {
    if (!scanning) return
    const id = setInterval(capture, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [scanning, capture])

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          FaceAttend
        </h1>
        <p className="text-slate-400 mt-1">
          Look at the camera to sign in or out
        </p>
      </div>

      <div className="relative">
        <WebcamCapture ref={webcamRef} className="w-[480px] h-[360px]" />
        {scanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-4 border-indigo-400 border-dashed rounded-full opacity-60 animate-spin" />
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        {result ? (
          <ClockResult result={result} />
        ) : (
          <div className="rounded-2xl bg-slate-800 border border-slate-700 px-8 py-6 text-center">
            <p className="text-slate-300 text-lg">Scanning…</p>
            <p className="text-slate-500 text-sm mt-1">
              Position your face in the circle above
            </p>
          </div>
        )}
      </div>

      <a
        href="/login"
        className="text-slate-600 text-xs hover:text-slate-400 transition-colors"
      >
        Admin login →
      </a>
    </div>
  )
}

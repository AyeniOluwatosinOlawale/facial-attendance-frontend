import { forwardRef } from 'react'
import ReactWebcam from 'react-webcam'

const constraints: MediaTrackConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
}

const WebcamCapture = forwardRef<ReactWebcam, { className?: string }>(
  ({ className = '' }, ref) => (
    <ReactWebcam
      ref={ref}
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={constraints}
      className={`rounded-xl object-cover ${className}`}
    />
  )
)

WebcamCapture.displayName = 'WebcamCapture'
export default WebcamCapture

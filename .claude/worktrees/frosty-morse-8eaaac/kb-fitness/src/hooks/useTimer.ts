import { useState, useRef, useCallback, useEffect } from 'react'

function beep(ctx: AudioContext, freq: number, duration: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export interface TimerControls {
  remaining: number
  isRunning: boolean
  pause: () => void
  resume: () => void
  reset: (newDuration?: number) => void
  addSeconds: (sec: number) => void
}

export function useTimer(initialDuration: number, onComplete: () => void): TimerControls {
  const [remaining, setRemaining] = useState(initialDuration)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const remainingRef = useRef(initialDuration)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioCtxRef.current
  }, [])

  const pause = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (remainingRef.current <= 0) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1
      setRemaining(remainingRef.current)
      if (remainingRef.current > 0 && remainingRef.current <= 3) {
        try { beep(getAudioCtx(), 880, 0.1) } catch { /* audio unavailable */ }
      }
      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        try { beep(getAudioCtx(), 660, 0.3) } catch { /* audio unavailable */ }
        setIsRunning(false)
        onCompleteRef.current()
      }
    }, 1000)
  }, [getAudioCtx])

  const reset = useCallback((newDuration?: number) => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    const dur = newDuration ?? initialDuration
    remainingRef.current = dur
    setRemaining(dur)
    setIsRunning(false)
  }, [initialDuration])

  const addSeconds = useCallback((sec: number) => {
    remainingRef.current += sec
    setRemaining(prev => prev + sec)
  }, [])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  return { remaining, isRunning, pause, resume, reset, addSeconds }
}

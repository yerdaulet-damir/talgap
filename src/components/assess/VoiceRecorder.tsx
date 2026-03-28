'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, Square, ArrowRight } from 'lucide-react'
import { VoiceResult } from '@/lib/assessment/types'

interface VoiceRecorderProps {
  prompt: string
  maxDurationMs?: number
  onComplete: (result: VoiceResult) => void
}

export function VoiceRecorder({ prompt, maxDurationMs = 120000, onComplete }: VoiceRecorderProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded'>('idle')
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const startTimeRef = useRef(0)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(t => t.stop())
        transcribeWithWebSpeech()
      }

      mediaRecorder.start(1000)
      startTimeRef.current = Date.now()
      setStatus('recording')

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        setDuration(elapsed)
        if (elapsed >= maxDurationMs) {
          stopRecording()
        }
      }, 100)
    } catch {
      setTranscript('(Доступ к микрофону заблокирован — этап пропущен)')
      setStatus('recorded')
    }
  }, [maxDurationMs])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      if (timerRef.current) clearInterval(timerRef.current)
      setStatus('recorded')
    }
  }, [])

  const transcribeWithWebSpeech = () => {
    if (!transcript) {
      setTranscript('(Голос записан — транскрипция будет создана автоматически)')
    }
  }

  // Web Speech API for real-time transcription
  useEffect(() => {
    if (status !== 'recording') return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'ru-RU'

    recognition.onresult = (event: { results: { length: number; [key: number]: { isFinal: boolean; [key: number]: { transcript: string } } } }) => {
      let final = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' '
        }
      }
      if (final) setTranscript(final.trim())
    }

    try { recognition.start() } catch { /* ignore */ }

    return () => {
      try { recognition.stop() } catch { /* ignore */ }
    }
  }, [status])

  const handleSubmit = () => {
    const durationMs = duration || 1000
    const words = transcript.split(/\s+/).filter(Boolean).length
    const wpm = words / (durationMs / 60000)

    onComplete({
      audioUrl: audioUrl || undefined,
      transcript: transcript || '(Транскрипция недоступна)',
      durationMs,
      wordCount: words,
      wordsPerMinute: Math.round(wpm * 10) / 10,
    })
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${m}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl md:text-3xl font-medium leading-snug text-[#010042]"
      >
        {prompt}
      </motion.h2>

      {/* Record button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-6"
      >
        {status === 'idle' && (
          <>
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-[#010042] hover:bg-[#010042]/90 flex items-center justify-center transition-colors shadow-lg shadow-[#010042]/15"
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
            <p className="text-base text-gray-600 max-w-md">
              Нажмите на микрофон и говорите свободно. Нет правильного ответа — нам важен ваш голос, ваши мысли и то, как вы их выражаете.
            </p>
            <p className="text-sm text-gray-400">
              Максимум {formatTime(maxDurationMs)}
            </p>
          </>
        )}

        {status === 'recording' && (
          <>
            <button
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center animate-pulse shadow-lg shadow-red-500/20"
            >
              <Square className="w-8 h-8 text-white" />
            </button>

            {/* Waveform visualization */}
            <div className="flex items-center gap-1 h-12">
              {Array.from({ length: 30 }, (_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [4, Math.random() * 40 + 4, 4],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5 + Math.random() * 0.5,
                    delay: i * 0.03,
                  }}
                  className="w-1 bg-[#010042] rounded-full"
                />
              ))}
            </div>

            <span className="text-2xl font-mono text-[#010042]">{formatTime(duration)}</span>
            <span className="text-sm text-gray-400">Нажмите, чтобы остановить</span>
          </>
        )}

        {status === 'recorded' && (
          <>
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full max-w-md" />
            )}

            {transcript && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 max-w-md text-left">
                <p className="text-sm text-[#010042] uppercase tracking-wider mb-2 font-semibold">Транскрипция</p>
                <p className="text-base text-gray-600 leading-relaxed">{transcript}</p>
              </div>
            )}

            <span className="text-sm text-gray-500 font-mono">{formatTime(duration)}</span>
          </>
        )}
      </motion.div>

      {status === 'recorded' && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-[#010042] hover:bg-[#010042]/90 text-white rounded-full gap-2 px-6"
          >
            Продолжить
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

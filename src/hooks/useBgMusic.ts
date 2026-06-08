import { useEffect, useRef, useCallback } from "react"
import { useGreenhouseStore } from "@/store/greenhouse"
import type { BgMusicType } from "@/types"

const AUDIO_URLS: Record<Exclude<BgMusicType, "none">, string> = {
  rain: "https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3",
  forest: "https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-1216.mp3",
  piano: "https://assets.mixkit.co/sfx/preview/mixkit-relaxing-piano-melody-1021.mp3",
}

export function useBgMusic() {
  const bgMusic = useGreenhouseStore((s) => s.environment.bgMusic)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentRef = useRef<BgMusicType>("none")

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (currentRef.current === bgMusic) return

    stopCurrent()

    if (bgMusic !== "none" && AUDIO_URLS[bgMusic]) {
      const audio = new Audio(AUDIO_URLS[bgMusic])
      audio.loop = true
      audio.volume = 0.4
      audio.play().catch(() => {})
      audioRef.current = audio
    }

    currentRef.current = bgMusic

    return () => {
      stopCurrent()
    }
  }, [bgMusic, stopCurrent])
}

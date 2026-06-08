import { useEffect, useRef } from "react"
import type { WeatherType, TimeOfDay } from "@/types"

interface WeatherEffectsProps {
  weather: WeatherType
  timeOfDay: TimeOfDay
}

export default function WeatherEffects({ weather, timeOfDay }: WeatherEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    interface Particle {
      x: number
      y: number
      speed: number
      size: number
      opacity: number
      drift?: number
    }

    let particles: Particle[] = []

    const initParticles = () => {
      particles = []
      const count = weather === "rainy" ? 60 : weather === "snowy" ? 40 : weather === "starry" ? 30 : 20
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: weather === "rainy" ? 3 + Math.random() * 4 : weather === "snowy" ? 0.5 + Math.random() * 1.5 : 0,
          size: weather === "rainy" ? 1.5 : weather === "snowy" ? 2 + Math.random() * 3 : weather === "starry" ? 1 + Math.random() * 2 : 3 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.7,
          drift: weather === "snowy" ? (Math.random() - 0.5) * 0.5 : 0,
        })
      }
    }

    initParticles()

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      if (weather === "sunny" && timeOfDay === "morning") {
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(255, 223, 100, ${p.opacity * 0.3})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          p.y += 0.2
          p.x += 0.1
          if (p.y > h) { p.y = -5; p.x = Math.random() * w }
        })
      } else if (weather === "rainy") {
        particles.forEach((p) => {
          ctx.strokeStyle = `rgba(150, 200, 255, ${p.opacity * 0.6})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - 1, p.y + p.speed * 2)
          ctx.stroke()
          p.y += p.speed
          p.x -= 0.5
          if (p.y > h) { p.y = -10; p.x = Math.random() * w }
        })
      } else if (weather === "snowy") {
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          p.y += p.speed
          p.x += (p.drift || 0)
          if (p.y > h) { p.y = -5; p.x = Math.random() * w }
        })
      } else if (weather === "starry") {
        particles.forEach((p) => {
          const twinkle = 0.5 + Math.sin(Date.now() * 0.003 + p.x) * 0.5
          ctx.fillStyle = `rgba(255, 255, 220, ${p.opacity * twinkle})`
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.max(1, p.size), Math.max(1, p.size))
        })
      } else if (weather === "cloudy") {
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(200, 200, 210, ${p.opacity * 0.2})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx.fill()
          p.x += 0.3
          if (p.x > w + 20) { p.x = -20 }
        })
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [weather, timeOfDay])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

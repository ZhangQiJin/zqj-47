import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface WateringAnimationProps {
  active: boolean
  onComplete: () => void
}

export default function WateringAnimation({ active, onComplete }: WateringAnimationProps) {
  const [droplets, setDroplets] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    if (active) {
      const newDroplets = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: 30 + Math.random() * 40,
        delay: i * 0.08,
      }))
      setDroplets(newDroplets)
      const timer = setTimeout(() => {
        setDroplets([])
        onComplete()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  return (
    <AnimatePresence>
      {droplets.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {droplets.map((d) => (
            <motion.div
              key={d.id}
              initial={{ y: -20, opacity: 1, scale: 1 }}
              animate={{ y: 120, opacity: 0, scale: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: d.delay, ease: "easeIn" }}
              className="absolute"
              style={{ left: `${d.x}%` }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 6,
                  height: 8,
                  backgroundColor: "#7EC8E3",
                  boxShadow: "0 0 4px rgba(126,200,227,0.5)",
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

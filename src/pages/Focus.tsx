import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useGreenhouseStore } from "@/store/greenhouse"
import PixelPlant from "@/components/PixelPlant"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, Play, Pause, RotateCcw, Check, X } from "lucide-react"

const TIMER_OPTIONS = [
  { minutes: 5, label: "5分钟" },
  { minutes: 10, label: "10分钟" },
  { minutes: 15, label: "15分钟" },
  { minutes: 25, label: "25分钟" },
  { minutes: 45, label: "45分钟" },
]

export default function Focus() {
  const { plants, addFocusSession, waterPlantByFocus } = useGreenhouseStore()
  const navigate = useNavigate()
  const [selectedMinutes, setSelectedMinutes] = useState(25)
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [selectingPlant, setSelectingPlant] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, remainingSeconds])

  const handleStart = useCallback(() => {
    if (remainingSeconds <= 0) return
    setIsRunning(true)
  }, [remainingSeconds])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setRemainingSeconds(selectedMinutes * 60)
    setIsComplete(false)
  }, [selectedMinutes])

  const handleSelectTime = useCallback((minutes: number) => {
    if (isRunning) return
    setSelectedMinutes(minutes)
    setRemainingSeconds(minutes * 60)
    setIsComplete(false)
  }, [isRunning])

  const handleFinish = useCallback((plantId: string) => {
    addFocusSession(selectedMinutes, plantId)
    waterPlantByFocus(plantId, selectedMinutes)
    setSelectingPlant(false)
    setIsComplete(false)
    setRemainingSeconds(selectedMinutes * 60)
  }, [selectedMinutes, addFocusSession, waterPlantByFocus])

  const totalSeconds = selectedMinutes * 60
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className="min-h-screen pb-20 flex flex-col" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="px-4 pt-4 pb-2">
        <h1
          className="text-2xl"
          style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
        >
          ⏳ 专注计时
        </h1>
        <p className="text-sm text-stone-400 mt-1">专注完成，为植物提供生长值</p>
      </header>

      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.minutes}
              onClick={() => handleSelectTime(opt.minutes)}
              disabled={isRunning}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedMinutes === opt.minutes && !isRunning
                  ? "pixel-btn-primary text-white"
                  : isRunning
                  ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                  : "bg-white text-stone-500 border border-stone-200 hover:border-green-300"
              }`}
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative mb-8">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#E8E0D4"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#4A7C59"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl tabular-nums"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: isRunning ? "#4A7C59" : "#8B6F47" }}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs text-stone-400 mt-1">
              {isRunning ? "专注中..." : isComplete ? "完成!" : "准备开始"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {!isRunning && !isComplete && (
            <button
              onClick={handleStart}
              disabled={plants.length === 0}
              className="w-16 h-16 rounded-2xl flex items-center justify-center pixel-btn-primary text-white hover:scale-105 active:scale-95 transition-transform"
            >
              <Play size={28} />
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="w-16 h-16 rounded-2xl flex items-center justify-center pixel-btn-primary text-white hover:scale-105 active:scale-95 transition-transform"
            >
              <Pause size={28} />
            </button>
          )}

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-stone-200 text-stone-500 hover:text-green-600 hover:border-green-300 transition-colors"
          >
            <RotateCcw size={20} />
          </button>

          {isComplete && (
            <button
              onClick={() => setSelectingPlant(true)}
              className="w-16 h-16 rounded-2xl flex items-center justify-center pixel-btn-primary text-white hover:scale-105 active:scale-95 transition-transform"
            >
              <Check size={28} />
            </button>
          )}
        </div>

        {plants.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center max-w-xs">
            <p className="text-sm text-amber-700" style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}>
              你还没有植物哦，去温室种一株吧！
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-4 py-1 rounded-lg bg-green-600 text-white text-sm"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
            >
              去种植
            </button>
          </div>
        )}

        {isComplete && plants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 text-center max-w-xs"
          >
            <p className="text-lg mb-1" style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}>
              🎉 专注完成！
            </p>
            <p className="text-sm text-green-700">
              点击 ✓ 为植物提供 +{Math.min(20, selectedMinutes * 2)}% 生长值
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectingPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectingPlant(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-2xl p-5 pixel-border"
              style={{ backgroundColor: "#F5F0E8" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg"
                  style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
                >
                  🌱 选择受益植物
                </h3>
                <button onClick={() => setSelectingPlant(false)} className="p-1 rounded-lg hover:bg-stone-200 transition-colors">
                  <X size={18} className="text-stone-500" />
                </button>
              </div>
              <p className="text-xs text-stone-400 mb-3">
                专注 {selectedMinutes} 分钟，为植物提供 +{Math.min(20, selectedMinutes * 2)}% 生长值
              </p>
              <div className="space-y-2">
                {plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => handleFinish(plant.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-stone-200 hover:border-green-400 hover:bg-green-50 transition-all"
                  >
                    <PixelPlant type={plant.type} stage={plant.stage} size={36} animated={false} />
                    <div className="flex-1 text-left">
                      <p className="font-bold text-stone-700" style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}>
                        {plant.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">{plant.stage}</span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs text-green-600">{plant.growthProgress}%</span>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-bold">+{Math.min(20, selectedMinutes * 2)}%</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

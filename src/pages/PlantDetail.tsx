import { useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGreenhouseStore } from "@/store/greenhouse"
import PixelPlant from "@/components/PixelPlant"
import PixelPot from "@/components/PixelPot"
import WateringAnimation from "@/components/WateringAnimation"
import { ArrowLeft, Droplets, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { PLANT_DISPLAY_NAMES, STAGE_ORDER, GROWTH_THRESHOLDS } from "@/types"
import type { GrowthStage } from "@/types"

const STAGE_NAMES: Record<GrowthStage, string> = {
  seed: "种子",
  sprout: "发芽",
  seedling: "幼苗",
  growing: "成长",
  mature: "成熟",
  blooming: "绽放",
}

const STAGE_EMOJI: Record<GrowthStage, string> = {
  seed: "🟤",
  sprout: "🌱",
  seedling: "🌿",
  growing: "🪴",
  mature: "🌳",
  blooming: "🌸",
}

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { plants, habits, waterPlant, completeHabit, removePlant } = useGreenhouseStore()
  const [watering, setWatering] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const plant = plants.find((p) => p.id === id)

  const handleWater = useCallback(
    (habitId: string) => {
      if (!plant || watering) return
      const habit = habits.find((h) => h.id === habitId)
      if (!habit || habit.completedToday) return

      completeHabit(habitId)
      setWatering(true)
      waterPlant(plant.id, habitId, habit.name)

      setTimeout(() => {
        setWatering(false)
      }, 1200)
    },
    [plant, habits, watering, completeHabit, waterPlant]
  )

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p className="text-stone-400" style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}>
          植物不存在
        </p>
      </div>
    )
  }

  const currentStageIndex = STAGE_ORDER.indexOf(plant.stage)
  const nextStage = currentStageIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentStageIndex + 1] : null
  const progressInStage = nextStage
    ? ((plant.growthProgress - GROWTH_THRESHOLDS[plant.stage]) /
        (GROWTH_THRESHOLDS[nextStage] - GROWTH_THRESHOLDS[plant.stage])) *
      100
    : 100

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/60 hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} className="text-stone-600" />
          <span className="text-sm text-stone-600" style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}>返回</span>
        </button>

        <h1
          className="text-xl"
          style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
        >
          🌱 {plant.name}
        </h1>

        <button
          onClick={() => setShowDelete(!showDelete)}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Trash2 size={18} className="text-stone-400" />
        </button>
      </header>

      {showDelete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between"
        >
          <span className="text-sm text-red-600">确定移除这株植物？</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                removePlant(plant.id)
                navigate("/")
              }}
              className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs"
            >
              移除
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="px-3 py-1 rounded-lg bg-white border text-stone-500 text-xs"
            >
              取消
            </button>
          </div>
        </motion.div>
      )}

      <div className="px-4">
        <div className="bg-white rounded-2xl p-6 mb-4 pixel-border-soft">
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-2">
              <PixelPlant type={plant.type} stage={plant.stage} size={96} animated />
              <WateringAnimation active={watering} onComplete={() => {}} />
            </div>
            <PixelPot style={plant.potStyle} width={96} />
          </div>

          <div className="text-center mb-4">
            <span className="text-2xl mr-2">{STAGE_EMOJI[plant.stage]}</span>
            <span
              className="text-xl"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
            >
              {STAGE_NAMES[plant.stage]}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>{PLANT_DISPLAY_NAMES[plant.type]}</span>
              <span>{plant.growthProgress}%</span>
            </div>
            <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "#4A7C59" }}
                initial={{ width: 0 }}
                animate={{ width: `${plant.growthProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {nextStage && (
            <p className="text-xs text-center text-stone-400 mt-2">
              距离 <span className="text-green-600 font-bold">{STAGE_NAMES[nextStage]}</span> 还需 {GROWTH_THRESHOLDS[nextStage] - plant.growthProgress}% 生长值
            </p>
          )}

          <div className="flex justify-around mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-green-700">{plant.waterHistory.length}</p>
              <p className="text-xs text-stone-400">浇水次数</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-700">
                {Math.floor((Date.now() - new Date(plant.plantedAt).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-xs text-stone-400">种植天数</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-700">{STAGE_ORDER.indexOf(plant.stage) + 1}/6</p>
              <p className="text-xs text-stone-400">生长阶段</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4 pixel-border-soft">
          <h3
            className="text-lg mb-3 flex items-center gap-2"
            style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
          >
            <Droplets size={18} />
            习惯浇水
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => handleWater(habit.id)}
                disabled={habit.completedToday || watering}
                className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${
                  habit.completedToday
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-stone-50 border-2 border-dashed border-stone-200 hover:border-green-300 hover:bg-green-50/50"
                }`}
              >
                <span className="text-lg">
                  {habit.completedToday ? "✅" : "💧"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${habit.completedToday ? "text-green-700" : "text-stone-700"}`}>
                    {habit.name}
                  </p>
                  <p className="text-xs text-stone-400">+{habit.waterAmount}%</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {plant.waterHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-4 pixel-border-soft">
            <h3
              className="text-lg mb-3"
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
            >
              📋 养护日志
            </h3>
            <div className="space-y-2">
              {plant.waterHistory
                .slice(-10)
                .reverse()
                .map((record, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    <span className="text-stone-400 text-xs">{record.date}</span>
                    <span className="text-stone-600">💧 {record.habitName}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

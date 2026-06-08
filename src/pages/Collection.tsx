import { useState } from "react"
import { useGreenhouseStore } from "@/store/greenhouse"
import PixelPlant from "@/components/PixelPlant"
import { RARITY_COLORS, RARITY_NAMES, PLANT_DISPLAY_NAMES } from "@/types"
import type { Rarity, PlantType } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, BookOpen, X } from "lucide-react"

const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"]
const RARITY_BG: Record<Rarity, string> = {
  common: "bg-green-50 border-green-200",
  rare: "bg-blue-50 border-blue-200",
  epic: "bg-purple-50 border-purple-200",
  legendary: "bg-amber-50 border-amber-200",
}

interface DetailModalProps {
  plantType: PlantType
  onClose: () => void
}

function DetailModal({ plantType, onClose }: DetailModalProps) {
  const { collection } = useGreenhouseStore()
  const found = collection.find((c) => c.plantType === plantType)!

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm rounded-2xl p-6 pixel-border"
        style={{ backgroundColor: "#F5F0E8" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-xl"
            style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
          >
            📖 {found.displayName}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-200 transition-colors">
            <X size={18} className="text-stone-500" />
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-xl ${RARITY_BG[found.rarity]}`}>
            <PixelPlant type={plantType} stage={found.unlocked ? "blooming" : "seed"} size={80} animated />
          </div>
        </div>

        <div className="mb-3">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: RARITY_COLORS[found.rarity] }}
          >
            {RARITY_NAMES[found.rarity]}
          </span>
        </div>

        <p className="text-sm text-stone-600 mb-3" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
          {found.unlocked ? found.description : "???"}
        </p>

        <div className="bg-white rounded-xl p-3">
          <p className="text-xs text-stone-400">
            🔓 解锁条件：{found.unlockCondition}
          </p>
          {found.unlocked && found.unlockedAt && (
            <p className="text-xs text-green-600 mt-1">
              ✅ 已于 {new Date(found.unlockedAt).toLocaleDateString("zh-CN")} 解锁
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Collection() {
  const { collection } = useGreenhouseStore()
  const [selectedType, setSelectedType] = useState<PlantType | null>(null)
  const [filterRarity, setFilterRarity] = useState<Rarity | "all">("all")

  const unlockedCount = collection.filter((c) => c.unlocked).length

  const filtered = filterRarity === "all"
    ? collection
    : collection.filter((c) => c.rarity === filterRarity)

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="px-4 pt-4 pb-2">
        <h1
          className="text-2xl"
          style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
        >
          📖 植物图鉴
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          已收集 {unlockedCount}/{collection.length} 种植物
        </p>
      </header>

      <div className="px-4 mb-4">
        <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "#4A7C59" }}
            animate={{ width: `${(unlockedCount / collection.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterRarity("all")}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filterRarity === "all"
              ? "bg-green-600 text-white"
              : "bg-white text-stone-500 hover:bg-green-50"
          }`}
          style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
        >
          全部
        </button>
        {RARITY_ORDER.map((r) => (
          <button
            key={r}
            onClick={() => setFilterRarity(r)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterRarity === r
                ? "text-white"
                : "bg-white text-stone-500 hover:opacity-80"
            }`}
            style={{
              fontFamily: "'ZCOOL QingKe HuangYou', cursive",
              backgroundColor: filterRarity === r ? RARITY_COLORS[r] : undefined,
              borderColor: RARITY_COLORS[r],
            }}
          >
            {RARITY_NAMES[r]}
          </button>
        ))}
      </div>

      <div className="px-4">
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((entry) => (
            <motion.button
              key={entry.plantType}
              onClick={() => setSelectedType(entry.plantType)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative bg-white rounded-xl p-3 flex flex-col items-center transition-all ${
                entry.unlocked
                  ? `border-2 cursor-pointer`
                  : "border-2 border-stone-200 opacity-70"
              }`}
              style={{
                borderColor: entry.unlocked ? RARITY_COLORS[entry.rarity] : undefined,
              }}
            >
              {entry.unlocked ? (
                <PixelPlant type={entry.plantType} stage="mature" size={48} animated={false} />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center">
                  <Lock size={24} className="text-stone-300" />
                </div>
              )}

              <span
                className="text-xs mt-2 text-stone-700"
                style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
              >
                {entry.unlocked ? entry.displayName : "???"}
              </span>

              <span
                className="text-xs px-2 py-0.5 rounded-full mt-1 text-white"
                style={{ backgroundColor: RARITY_COLORS[entry.rarity], fontSize: 10 }}
              >
                {RARITY_NAMES[entry.rarity]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedType && (
          <DetailModal plantType={selectedType} onClose={() => setSelectedType(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

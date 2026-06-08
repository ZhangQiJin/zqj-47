import { useState } from "react"
import { useGreenhouseStore } from "@/store/greenhouse"
import type { PlantType, PotStyle } from "@/types"
import { PLANT_DISPLAY_NAMES } from "@/types"
import PixelPlant from "./PixelPlant"
import PixelPot from "./PixelPot"
import { X, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PlantingModalProps {
  open: boolean
  onClose: () => void
}

const POT_OPTIONS: PotStyle[] = ["terracotta", "ceramic", "glass", "wooden", "stone"]
const POT_NAMES: Record<PotStyle, string> = {
  terracotta: "陶土盆",
  ceramic: "陶瓷盆",
  glass: "玻璃盆",
  wooden: "木盆",
  stone: "石盆",
}

export default function PlantingModal({ open, onClose }: PlantingModalProps) {
  const { collection, addPlant } = useGreenhouseStore()
  const [selectedType, setSelectedType] = useState<PlantType | null>(null)
  const [selectedPot, setSelectedPot] = useState<PotStyle>("terracotta")
  const [plantName, setPlantName] = useState("")

  const unlockedTypes = collection.filter((c) => c.unlocked).map((c) => c.plantType)

  const handlePlant = () => {
    if (!selectedType) return
    addPlant(selectedType, plantName || PLANT_DISPLAY_NAMES[selectedType], selectedPot)
    setSelectedType(null)
    setSelectedPot("terracotta")
    setPlantName("")
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
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
            className="w-full max-w-md rounded-2xl p-6 pixel-border"
            style={{ backgroundColor: "#F5F0E8" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl"
                style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: "#4A7C59" }}
              >
                🌱 种植新植物
              </h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-200 transition-colors">
                <X size={20} className="text-stone-500" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-sm font-bold text-stone-600 block mb-2">选择植物</label>
              <div className="grid grid-cols-5 gap-2">
                {unlockedTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                      selectedType === type
                        ? "border-green-500 bg-green-50"
                        : "border-stone-200 hover:border-green-300"
                    }`}
                  >
                    <PixelPlant type={type} stage="seedling" size={32} animated={false} />
                    <span className="text-xs text-stone-600">{PLANT_DISPLAY_NAMES[type]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-bold text-stone-600 block mb-2">选择花盆</label>
              <div className="flex gap-2">
                {POT_OPTIONS.map((pot) => (
                  <button
                    key={pot}
                    onClick={() => setSelectedPot(pot)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                      selectedPot === pot
                        ? "border-green-500 bg-green-50"
                        : "border-stone-200 hover:border-green-300"
                    }`}
                  >
                    <PixelPot style={pot} width={40} />
                    <span className="text-xs text-stone-600">{POT_NAMES[pot]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-bold text-stone-600 block mb-2">起个名字</label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder={selectedType ? PLANT_DISPLAY_NAMES[selectedType] : "给植物取个名字..."}
                className="w-full px-3 py-2 rounded-lg border-2 border-stone-200 bg-white text-stone-700 focus:border-green-400 focus:outline-none transition-colors"
                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
              />
            </div>

            {selectedType && (
              <div className="mb-4 flex justify-center">
                <div className="flex flex-col items-center">
                  <PixelPlant type={selectedType} stage="seed" size={64} animated />
                  <PixelPot style={selectedPot} width={64} />
                </div>
              </div>
            )}

            <button
              onClick={handlePlant}
              disabled={!selectedType}
              className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                selectedType
                  ? "pixel-btn-primary text-white"
                  : "bg-stone-300 text-stone-500 cursor-not-allowed"
              }`}
              style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
            >
              <Plus size={20} />
              种下去
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

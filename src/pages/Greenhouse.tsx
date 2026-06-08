import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useGreenhouseStore } from "@/store/greenhouse"
import { useBgMusic } from "@/hooks/useBgMusic"
import PixelPlant from "@/components/PixelPlant"
import PixelPot from "@/components/PixelPot"
import WeatherEffects from "@/components/WeatherEffects"
import PlantingModal from "@/components/PlantingModal"
import WateringAnimation from "@/components/WateringAnimation"
import { Plus, Calendar, Cloud, Sun, CloudRain, Snowflake, Star, Cloudy, Music, Volume2, VolumeX } from "lucide-react"
import type { WeatherType, TimeOfDay, WindowsillType, BgMusicType } from "@/types"
import { motion } from "framer-motion"

const WEATHER_ICONS: Record<WeatherType, typeof Sun> = {
  sunny: Sun,
  rainy: CloudRain,
  snowy: Snowflake,
  cloudy: Cloud,
  starry: Star,
}

const WEATHER_NAMES: Record<WeatherType, string> = {
  sunny: "晴天",
  rainy: "雨天",
  snowy: "雪天",
  cloudy: "多云",
  starry: "星空",
}

const TIME_NAMES: Record<TimeOfDay, string> = {
  morning: "清晨",
  afternoon: "午后",
  evening: "傍晚",
  night: "夜晚",
}

const SILL_NAMES: Record<WindowsillType, string> = {
  wooden: "木窗台",
  marble: "大理石",
  brick: "砖墙",
  concrete: "水泥",
}

const MUSIC_NAMES: Record<BgMusicType, string> = {
  rain: "雨声",
  forest: "森林",
  piano: "钢琴",
  none: "关闭",
}

const MUSIC_ICONS: Record<BgMusicType, typeof Volume2> = {
  rain: CloudRain,
  forest: Cloud,
  piano: Music,
  none: VolumeX,
}

const TIME_BG: Record<TimeOfDay, { sky: string; ground: string; sill: string }> = {
  morning: { sky: "linear-gradient(180deg, #87CEEB 0%, #E0F0FF 50%, #FFF8E7 100%)", ground: "#C4B99A", sill: "#A0845C" },
  afternoon: { sky: "linear-gradient(180deg, #4A90D9 0%, #87CEEB 50%, #B8E0FF 100%)", ground: "#B8A88A", sill: "#8B7355" },
  evening: { sky: "linear-gradient(180deg, #E8945A 0%, #F5C28A 40%, #FFD4A8 100%)", ground: "#9E8B6E", sill: "#7A6B52" },
  night: { sky: "linear-gradient(180deg, #1A1A3E 0%, #2D2D5E 50%, #3D3D6E 100%)", ground: "#6B6152", sill: "#5A4E3E" },
}

export default function Greenhouse() {
  const { plants, environment, checkinData, setWeather, setTimeOfDay, setWindowsill, setBgMusic, doCheckin } = useGreenhouseStore()
  useBgMusic()
  const navigate = useNavigate()
  const [showPlanting, setShowPlanting] = useState(false)
  const [showEnvPanel, setShowEnvPanel] = useState(false)
  const [wateringPlant, setWateringPlant] = useState<string | null>(null)

  const today = new Date().toISOString().split("T")[0]
  const hasCheckedIn = checkinData.lastCheckin === today

  const bg = TIME_BG[environment.timeOfDay]

  const handleWaterComplete = useCallback(() => {
    setWateringPlant(null)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bg.sky }}>
      <WeatherEffects weather={environment.weather} timeOfDay={environment.timeOfDay} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 py-3">
          <button
            onClick={doCheckin}
            disabled={hasCheckedIn}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              hasCheckedIn
                ? "bg-green-100 text-green-700"
                : "pixel-btn-primary text-white"
            }`}
            style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
          >
            <Calendar size={16} />
            {hasCheckedIn ? `已签到 · ${checkinData.streak}天` : "签到"}
          </button>

          <h1
            className="text-2xl tracking-wider"
            style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive", color: environment.timeOfDay === "night" ? "#E8DFD0" : "#4A7C59" }}
          >
            🏡 像素温室
          </h1>

          <button
            onClick={() => setShowEnvPanel(!showEnvPanel)}
            className="p-2 rounded-xl bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
          >
            <Cloudy size={20} className={environment.timeOfDay === "night" ? "text-stone-300" : "text-stone-600"} />
          </button>
        </header>

        <div className="flex-1 flex items-end justify-center pb-20 px-4">
          <div className="w-full max-w-2xl">
            <div
              className="relative rounded-t-2xl p-6 min-h-[320px] flex items-end justify-center gap-4 flex-wrap"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${bg.sill}33 100%)`,
              }}
            >
              {plants.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🌱</p>
                  <p
                    className="text-stone-500 text-lg"
                    style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
                  >
                    温室空空的，种点什么吧
                  </p>
                </div>
              ) : (
                plants.map((plant) => (
                  <motion.div
                    key={plant.id}
                    className="flex flex-col items-center cursor-pointer group"
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/plant/${plant.id}`)}
                  >
                    <div className="relative">
                      <PixelPlant type={plant.type} stage={plant.stage} size={56} />
                      <WateringAnimation
                        active={wateringPlant === plant.id}
                        onComplete={handleWaterComplete}
                      />
                    </div>
                    <PixelPot style={plant.potStyle} width={56} />
                    <span
                      className="text-xs mt-1 text-stone-600 group-hover:text-green-700 transition-colors"
                      style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                    >
                      {plant.name}
                    </span>
                    <div className="w-12 h-1 rounded-full bg-stone-300 mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${plant.growthProgress}%`, backgroundColor: "#4A7C59" }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div
              className="h-6 rounded-b-2xl"
              style={{ backgroundColor: bg.sill }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowPlanting(true)}
          className="fixed right-6 bottom-20 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 pixel-btn-primary"
          style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}
        >
          <Plus size={24} className="text-white" />
        </button>

        {showEnvPanel && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-4"
          >
            <div className="max-w-md mx-auto rounded-2xl p-4 pixel-border" style={{ backgroundColor: "rgba(245,240,232,0.97)" }}>
              <div className="mb-3">
                <p className="text-xs font-bold text-stone-500 mb-2">天气</p>
                <div className="flex gap-2">
                  {(Object.keys(WEATHER_ICONS) as WeatherType[]).map((w) => {
                    const Icon = WEATHER_ICONS[w]
                    return (
                      <button
                        key={w}
                        onClick={() => setWeather(w)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all ${
                          environment.weather === w
                            ? "bg-green-100 border-2 border-green-500"
                            : "bg-white border border-stone-200 hover:border-green-300"
                        }`}
                      >
                        <Icon size={16} className={environment.weather === w ? "text-green-600" : "text-stone-400"} />
                        {WEATHER_NAMES[w]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-bold text-stone-500 mb-2">时间</p>
                <div className="flex gap-2">
                  {(Object.keys(TIME_NAMES) as TimeOfDay[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeOfDay(t)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        environment.timeOfDay === t
                          ? "bg-green-100 border-2 border-green-500 text-green-700"
                          : "bg-white border border-stone-200 hover:border-green-300 text-stone-500"
                      }`}
                    >
                      {TIME_NAMES[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-bold text-stone-500 mb-2">窗台</p>
                <div className="flex gap-2">
                  {(Object.keys(SILL_NAMES) as WindowsillType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setWindowsill(s)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        environment.windowsill === s
                          ? "bg-green-100 border-2 border-green-500 text-green-700"
                          : "bg-white border border-stone-200 hover:border-green-300 text-stone-500"
                      }`}
                    >
                      {SILL_NAMES[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-500 mb-2">背景音乐</p>
                <div className="flex gap-2">
                  {(Object.keys(MUSIC_NAMES) as BgMusicType[]).map((m) => {
                    const Icon = MUSIC_ICONS[m]
                    return (
                      <button
                        key={m}
                        onClick={() => setBgMusic(m)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all ${
                          environment.bgMusic === m
                            ? "bg-green-100 border-2 border-green-500 text-green-700"
                            : "bg-white border border-stone-200 hover:border-green-300 text-stone-500"
                        }`}
                      >
                        <Icon size={16} className={environment.bgMusic === m ? "text-green-600" : "text-stone-400"} />
                        {MUSIC_NAMES[m]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <PlantingModal open={showPlanting} onClose={() => setShowPlanting(false)} />
    </div>
  )
}

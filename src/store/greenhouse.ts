import { create } from "zustand"
import type {
  Plant,
  Habit,
  Environment,
  CollectionEntry,
  PlantType,
  GrowthStage,
  WaterRecord,
  PotStyle,
  WeatherType,
  WindowsillType,
  BgMusicType,
  TimeOfDay,
} from "@/types"
import { GROWTH_THRESHOLDS, STAGE_ORDER } from "@/types"

const STORAGE_KEYS = {
  plants: "pixel-greenhouse-plants",
  habits: "pixel-greenhouse-habits",
  environment: "pixel-greenhouse-environment",
  collection: "pixel-greenhouse-collection",
  checkinData: "pixel-greenhouse-checkin",
  focusSessions: "pixel-greenhouse-focus",
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "喝水", icon: "droplets", category: "health", waterAmount: 8, completedToday: false, streak: 0, totalCompleted: 0 },
  { id: "h2", name: "拉伸", icon: "stretch", category: "body", waterAmount: 10, completedToday: false, streak: 0, totalCompleted: 0 },
  { id: "h3", name: "阅读", icon: "book-open", category: "mind", waterAmount: 12, completedToday: false, streak: 0, totalCompleted: 0 },
  { id: "h4", name: "深呼吸", icon: "wind", category: "health", waterAmount: 6, completedToday: false, streak: 0, totalCompleted: 0 },
  { id: "h5", name: "散步", icon: "footprints", category: "body", waterAmount: 10, completedToday: false, streak: 0, totalCompleted: 0 },
  { id: "h6", name: "冥想", icon: "brain", category: "mind", waterAmount: 14, completedToday: false, streak: 0, totalCompleted: 0 },
]

const DEFAULT_COLLECTION: CollectionEntry[] = [
  { plantType: "succulent", unlocked: true, unlockedAt: new Date().toISOString(), rarity: "common", unlockCondition: "初始植物", displayName: "多肉", description: "圆润可爱的小多肉，适合新手种植" },
  { plantType: "fern", unlocked: false, rarity: "common", unlockCondition: "连续签到3天", displayName: "蕨类", description: "优雅舒展的蕨类植物，喜欢湿润环境" },
  { plantType: "flower", unlocked: false, rarity: "common", unlockCondition: "浇水累计10次", displayName: "小花", description: "五颜六色的小花，给窗台带来色彩" },
  { plantType: "herb", unlocked: false, rarity: "rare", unlockCondition: "完成所有习惯1天", displayName: "香草", description: "散发淡淡清香的香草植物" },
  { plantType: "cactus", unlocked: false, rarity: "rare", unlockCondition: "连续签到7天", displayName: "仙人掌", description: "坚强耐旱的仙人掌，不需要太多关注" },
  { plantType: "tree", unlocked: false, rarity: "rare", unlockCondition: "任意植物达到成长期", displayName: "小树", description: "茁壮成长的小树苗，终将成为参天大树" },
  { plantType: "vine", unlocked: false, rarity: "epic", unlockCondition: "种植5株不同植物", displayName: "藤蔓", description: "蜿蜒攀爬的藤蔓，生命力旺盛" },
  { plantType: "mushroom", unlocked: false, rarity: "epic", unlockCondition: "种植3株植物并完成1次专注", displayName: "蘑菇", description: "雨后冒出的小蘑菇，神秘又可爱" },
  { plantType: "lotus", unlocked: false, rarity: "legendary", unlockCondition: "累计浇水50次", displayName: "莲花", description: "出淤泥而不染，优雅绽放的莲花" },
  { plantType: "crystal", unlocked: false, rarity: "legendary", unlockCondition: "收集所有其他植物", displayName: "水晶花", description: "传说中的水晶花，散发着奇幻的光芒" },
]

const DEFAULT_ENVIRONMENT: Environment = {
  windowsill: "wooden",
  weather: "sunny",
  bgMusic: "none",
  timeOfDay: "morning",
}

function calculateStage(progress: number): GrowthStage {
  for (let i = STAGE_ORDER.length - 1; i >= 0; i--) {
    if (progress >= GROWTH_THRESHOLDS[STAGE_ORDER[i]]) {
      return STAGE_ORDER[i]
    }
  }
  return "seed"
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0]
}

function resetDailyHabits(habits: Habit[]): Habit[] {
  const today = getTodayStr()
  return habits.map((h) => {
    if (h.completedToday) {
      const lastDate = localStorage.getItem(`habit-last-${h.id}`)
      if (lastDate !== today) {
        return { ...h, completedToday: false }
      }
    }
    return h
  })
}

interface CheckinData {
  lastCheckin: string
  streak: number
}

interface FocusSession {
  id: string
  date: string
  durationMinutes: number
  plantId: string
}

function checkAndUnlockCollection(
  collection: CollectionEntry[],
  plants: Plant[],
  habits: Habit[],
  checkinData: CheckinData,
  focusSessions: FocusSession[]
): CollectionEntry[] {
  const now = new Date().toISOString()
  const totalWaters = plants.reduce((sum, p) => sum + p.waterHistory.length, 0)
  const allHabitsCompletedToday = habits.length > 0 && habits.every((h) => h.completedToday)
  const hasGrowingPlant = plants.some((p) => STAGE_ORDER.indexOf(p.stage) >= STAGE_ORDER.indexOf("growing"))
  const uniquePlantTypes = new Set(plants.map((p) => p.type))
  const totalPlants = plants.length

  return collection.map((c) => {
    if (c.unlocked) return c

    let shouldUnlock = false

    switch (c.plantType) {
      case "fern":
        shouldUnlock = checkinData.streak >= 3
        break
      case "flower":
        shouldUnlock = totalWaters >= 10
        break
      case "herb":
        shouldUnlock = allHabitsCompletedToday
        break
      case "cactus":
        shouldUnlock = checkinData.streak >= 7
        break
      case "tree":
        shouldUnlock = hasGrowingPlant
        break
      case "vine":
        shouldUnlock = uniquePlantTypes.size >= 5
        break
      case "mushroom":
        shouldUnlock = totalPlants >= 3 && focusSessions.length >= 1
        break
      case "lotus":
        shouldUnlock = totalWaters >= 50
        break
      case "crystal":
        shouldUnlock = collection.filter((other) => other.unlocked && other.plantType !== "crystal").length >= 9
        break
    }

    return shouldUnlock ? { ...c, unlocked: true, unlockedAt: now } : c
  })
}

interface GreenhouseStore {
  plants: Plant[]
  habits: Habit[]
  environment: Environment
  collection: CollectionEntry[]
  checkinData: CheckinData
  focusSessions: FocusSession[]

  addPlant: (type: PlantType, name: string, potStyle: PotStyle) => void
  waterPlant: (plantId: string, habitId: string, habitName: string) => void
  waterPlantByFocus: (plantId: string, minutes: number) => void
  removePlant: (plantId: string) => void

  completeHabit: (habitId: string) => void
  resetHabitsIfNewDay: () => void

  setEnvironment: (env: Partial<Environment>) => void
  setWeather: (weather: WeatherType) => void
  setWindowsill: (windowsill: WindowsillType) => void
  setBgMusic: (music: BgMusicType) => void
  setTimeOfDay: (time: TimeOfDay) => void

  doCheckin: () => void

  addFocusSession: (durationMinutes: number, plantId: string) => void

  _persist: () => void
}

export const useGreenhouseStore = create<GreenhouseStore>((set, get) => {
  const initialPlants = loadFromStorage<Plant[]>(STORAGE_KEYS.plants, [])
  const initialHabits = resetDailyHabits(loadFromStorage<Habit[]>(STORAGE_KEYS.habits, DEFAULT_HABITS))
  const initialEnvironment = loadFromStorage<Environment>(STORAGE_KEYS.environment, DEFAULT_ENVIRONMENT)
  const initialCollection = loadFromStorage<CollectionEntry[]>(STORAGE_KEYS.collection, DEFAULT_COLLECTION)
  const initialCheckin = loadFromStorage<CheckinData>(STORAGE_KEYS.checkinData, { lastCheckin: "", streak: 0 })
  const initialFocus = loadFromStorage<FocusSession[]>(STORAGE_KEYS.focusSessions, [])

  const runCollectionCheck = (
    plants: Plant[],
    habits: Habit[],
    checkinData: CheckinData,
    focusSessions: FocusSession[],
    collection: CollectionEntry[]
  ): CollectionEntry[] => {
    const updated = checkAndUnlockCollection(collection, plants, habits, checkinData, focusSessions)
    if (updated !== collection) {
      saveToStorage(STORAGE_KEYS.collection, updated)
    }
    return updated
  }

  return {
    plants: initialPlants,
    habits: initialHabits,
    environment: initialEnvironment,
    collection: initialCollection,
    checkinData: initialCheckin,
    focusSessions: initialFocus,

    addPlant: (type, name, potStyle) => {
      set((state) => {
        const newPlant: Plant = {
          id: `plant-${Date.now()}`,
          name,
          type,
          stage: "seed",
          growthProgress: 0,
          potStyle,
          plantedAt: new Date().toISOString(),
          waterHistory: [],
        }
        const plants = [...state.plants, newPlant]
        saveToStorage(STORAGE_KEYS.plants, plants)
        const collection = runCollectionCheck(plants, state.habits, state.checkinData, state.focusSessions, state.collection)
        return { plants, collection }
      })
    },

    waterPlant: (plantId, habitId, habitName) => {
      set((state) => {
        const plants = state.plants.map((p) => {
          if (p.id !== plantId) return p
          const habit = state.habits.find((h) => h.id === habitId)
          const amount = habit?.waterAmount ?? 10
          const newProgress = Math.min(100, p.growthProgress + amount)
          const newStage = calculateStage(newProgress)
          const record: WaterRecord = {
            date: getTodayStr(),
            habitId,
            habitName,
          }
          return {
            ...p,
            growthProgress: newProgress,
            stage: newStage,
            waterHistory: [...p.waterHistory, record],
          }
        })
        saveToStorage(STORAGE_KEYS.plants, plants)
        const collection = runCollectionCheck(plants, state.habits, state.checkinData, state.focusSessions, state.collection)
        return { plants, collection }
      })
    },

    waterPlantByFocus: (plantId, minutes) => {
      set((state) => {
        const amount = Math.min(20, minutes * 2)
        const plants = state.plants.map((p) => {
          if (p.id !== plantId) return p
          const newProgress = Math.min(100, p.growthProgress + amount)
          const newStage = calculateStage(newProgress)
          const record: WaterRecord = {
            date: getTodayStr(),
            habitId: "focus",
            habitName: `专注${minutes}分钟`,
          }
          return {
            ...p,
            growthProgress: newProgress,
            stage: newStage,
            waterHistory: [...p.waterHistory, record],
          }
        })
        saveToStorage(STORAGE_KEYS.plants, plants)
        const collection = runCollectionCheck(plants, state.habits, state.checkinData, state.focusSessions, state.collection)
        return { plants, collection }
      })
    },

    removePlant: (plantId) => {
      set((state) => {
        const plants = state.plants.filter((p) => p.id !== plantId)
        saveToStorage(STORAGE_KEYS.plants, plants)
        return { plants }
      })
    },

    completeHabit: (habitId) => {
      set((state) => {
        const today = getTodayStr()
        const habits = state.habits.map((h) => {
          if (h.id !== habitId) return h
          localStorage.setItem(`habit-last-${h.id}`, today)
          const newStreak = h.completedToday ? h.streak : h.streak + 1
          return {
            ...h,
            completedToday: true,
            streak: newStreak,
            totalCompleted: h.totalCompleted + 1,
          }
        })
        saveToStorage(STORAGE_KEYS.habits, habits)
        const collection = runCollectionCheck(state.plants, habits, state.checkinData, state.focusSessions, state.collection)
        return { habits, collection }
      })
    },

    resetHabitsIfNewDay: () => {
      set((state) => {
        const habits = resetDailyHabits(state.habits)
        saveToStorage(STORAGE_KEYS.habits, habits)
        return { habits }
      })
    },

    setEnvironment: (env) => {
      set((state) => {
        const environment = { ...state.environment, ...env }
        saveToStorage(STORAGE_KEYS.environment, environment)
        return { environment }
      })
    },

    setWeather: (weather) => {
      set((state) => {
        const environment = { ...state.environment, weather }
        saveToStorage(STORAGE_KEYS.environment, environment)
        return { environment }
      })
    },

    setWindowsill: (windowsill) => {
      set((state) => {
        const environment = { ...state.environment, windowsill }
        saveToStorage(STORAGE_KEYS.environment, environment)
        return { environment }
      })
    },

    setBgMusic: (bgMusic) => {
      set((state) => {
        const environment = { ...state.environment, bgMusic }
        saveToStorage(STORAGE_KEYS.environment, environment)
        return { environment }
      })
    },

    setTimeOfDay: (timeOfDay) => {
      set((state) => {
        const environment = { ...state.environment, timeOfDay }
        saveToStorage(STORAGE_KEYS.environment, environment)
        return { environment }
      })
    },

    doCheckin: () => {
      set((state) => {
        const today = getTodayStr()
        if (state.checkinData.lastCheckin === today) return state
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]
        const newStreak = state.checkinData.lastCheckin === yesterdayStr ? state.checkinData.streak + 1 : 1
        const checkinData = { lastCheckin: today, streak: newStreak }
        saveToStorage(STORAGE_KEYS.checkinData, checkinData)
        const collection = runCollectionCheck(state.plants, state.habits, checkinData, state.focusSessions, state.collection)
        return { checkinData, collection }
      })
    },

    addFocusSession: (durationMinutes, plantId) => {
      set((state) => {
        const session: FocusSession = {
          id: `focus-${Date.now()}`,
          date: getTodayStr(),
          durationMinutes,
          plantId,
        }
        const focusSessions = [...state.focusSessions, session]
        saveToStorage(STORAGE_KEYS.focusSessions, focusSessions)
        const collection = runCollectionCheck(state.plants, state.habits, state.checkinData, focusSessions, state.collection)
        return { focusSessions, collection }
      })
    },

    _persist: () => {
      const state = get()
      saveToStorage(STORAGE_KEYS.plants, state.plants)
      saveToStorage(STORAGE_KEYS.habits, state.habits)
      saveToStorage(STORAGE_KEYS.environment, state.environment)
      saveToStorage(STORAGE_KEYS.collection, state.collection)
      saveToStorage(STORAGE_KEYS.checkinData, state.checkinData)
      saveToStorage(STORAGE_KEYS.focusSessions, state.focusSessions)
    },
  }
})

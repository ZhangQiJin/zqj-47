export type PlantType = "succulent" | "fern" | "flower" | "herb" | "cactus" | "tree" | "vine" | "mushroom" | "lotus" | "crystal"

export type GrowthStage = "seed" | "sprout" | "seedling" | "growing" | "mature" | "blooming"

export type PotStyle = "terracotta" | "ceramic" | "glass" | "wooden" | "stone"

export type Rarity = "common" | "rare" | "epic" | "legendary"

export type HabitCategory = "health" | "mind" | "body"

export type WindowsillType = "wooden" | "marble" | "brick" | "concrete"

export type WeatherType = "sunny" | "rainy" | "snowy" | "cloudy" | "starry"

export type BgMusicType = "rain" | "forest" | "piano" | "none"

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

export interface WaterRecord {
  date: string
  habitId: string
  habitName: string
}

export interface Plant {
  id: string
  name: string
  type: PlantType
  stage: GrowthStage
  growthProgress: number
  potStyle: PotStyle
  plantedAt: string
  waterHistory: WaterRecord[]
}

export interface Habit {
  id: string
  name: string
  icon: string
  category: HabitCategory
  waterAmount: number
  completedToday: boolean
  streak: number
  totalCompleted: number
}

export interface Environment {
  windowsill: WindowsillType
  weather: WeatherType
  bgMusic: BgMusicType
  timeOfDay: TimeOfDay
}

export interface CollectionEntry {
  plantType: PlantType
  unlocked: boolean
  unlockedAt?: string
  rarity: Rarity
  unlockCondition: string
  displayName: string
  description: string
}

export const GROWTH_THRESHOLDS: Record<GrowthStage, number> = {
  seed: 0,
  sprout: 15,
  seedling: 35,
  growing: 60,
  mature: 85,
  blooming: 100,
}

export const STAGE_ORDER: GrowthStage[] = ["seed", "sprout", "seedling", "growing", "mature", "blooming"]

export const PLANT_DISPLAY_NAMES: Record<PlantType, string> = {
  succulent: "多肉",
  fern: "蕨类",
  flower: "小花",
  herb: "香草",
  cactus: "仙人掌",
  tree: "小树",
  vine: "藤蔓",
  mushroom: "蘑菇",
  lotus: "莲花",
  crystal: "水晶花",
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#4A7C59",
  rare: "#4A90D9",
  epic: "#9B59B6",
  legendary: "#E8945A",
}

export const RARITY_NAMES: Record<Rarity, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
}

import type { GrowthStage, PlantType } from "@/types"

interface PixelPlantProps {
  type: PlantType
  stage: GrowthStage
  size?: number
  animated?: boolean
}

const PLANT_COLORS: Record<PlantType, { main: string; dark: string; light: string; accent: string }> = {
  succulent: { main: "#5B8C5A", dark: "#3D6B3D", light: "#7FB069", accent: "#A8D5A2" },
  fern: { main: "#2E8B57", dark: "#1B5E3A", light: "#4CAF7D", accent: "#66BB6A" },
  flower: { main: "#4A7C59", dark: "#2D5A3A", light: "#6B9E7A", accent: "#FF6B8A" },
  herb: { main: "#6B8E4E", dark: "#4A6B33", light: "#8FB06A", accent: "#C5E1A5" },
  cactus: { main: "#2D7D46", dark: "#1B5E2E", light: "#4CAF50", accent: "#FF8A65" },
  tree: { main: "#3E7B27", dark: "#2A5C1A", light: "#5FA33E", accent: "#8BC34A" },
  vine: { main: "#4CAF50", dark: "#2E7D32", light: "#66BB6A", accent: "#A5D6A7" },
  mushroom: { main: "#8D6E63", dark: "#5D4037", light: "#A1887F", accent: "#E91E63" },
  lotus: { main: "#66BB6A", dark: "#388E3C", light: "#81C784", accent: "#F48FB1" },
  crystal: { main: "#7E57C2", dark: "#5E35B1", light: "#9575CD", accent: "#E1BEE7" },
}

export default function PixelPlant({ type, stage, size = 64, animated = true }: PixelPlantProps) {
  const colors = PLANT_COLORS[type]
  const pixelSize = Math.floor(size / 8)

  const getPlantPixels = () => {
    switch (stage) {
      case "seed":
        return renderSeed(colors, pixelSize)
      case "sprout":
        return renderSprout(colors, pixelSize)
      case "seedling":
        return renderSeedling(colors, pixelSize)
      case "growing":
        return renderGrowing(colors, pixelSize, type)
      case "mature":
        return renderMature(colors, pixelSize, type)
      case "blooming":
        return renderBlooming(colors, pixelSize, type)
      default:
        return renderSeed(colors, pixelSize)
    }
  }

  return (
    <div
      className={`relative ${animated ? "plant-sway" : ""}`}
      style={{ width: size, height: size }}
    >
      {getPlantPixels()}
    </div>
  )
}

function Pixel({ color, x, y, size }: { color: string; x: number; y: number; size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x * size,
        top: y * size,
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  )
}

function renderSeed(colors: typeof PLANT_COLORS.succulent, ps: number) {
  const pixels: { color: string; x: number; y: number }[] = [
    { color: colors.dark, x: 3, y: 5 },
    { color: colors.main, x: 4, y: 5 },
    { color: colors.dark, x: 3, y: 6 },
    { color: colors.main, x: 4, y: 6 },
    { color: colors.light, x: 3, y: 7 },
  ]
  return (
    <>
      {pixels.map((p, i) => (
        <Pixel key={i} color={p.color} x={p.x} y={p.y} size={ps} />
      ))}
    </>
  )
}

function renderSprout(colors: typeof PLANT_COLORS.succulent, ps: number) {
  const pixels: { color: string; x: number; y: number }[] = [
    { color: colors.light, x: 3, y: 3 },
    { color: colors.main, x: 4, y: 3 },
    { color: colors.main, x: 3, y: 4 },
    { color: colors.main, x: 4, y: 4 },
    { color: colors.dark, x: 3, y: 5 },
    { color: colors.dark, x: 4, y: 5 },
    { color: colors.dark, x: 3, y: 6 },
    { color: colors.dark, x: 4, y: 6 },
    { color: colors.main, x: 5, y: 4 },
  ]
  return (
    <>
      {pixels.map((p, i) => (
        <Pixel key={i} color={p.color} x={p.x} y={p.y} size={ps} />
      ))}
    </>
  )
}

function renderSeedling(colors: typeof PLANT_COLORS.succulent, ps: number) {
  const pixels: { color: string; x: number; y: number }[] = [
    { color: colors.light, x: 2, y: 2 },
    { color: colors.main, x: 3, y: 2 },
    { color: colors.light, x: 5, y: 2 },
    { color: colors.main, x: 3, y: 3 },
    { color: colors.light, x: 4, y: 3 },
    { color: colors.main, x: 5, y: 3 },
    { color: colors.dark, x: 3, y: 4 },
    { color: colors.main, x: 4, y: 4 },
    { color: colors.dark, x: 3, y: 5 },
    { color: colors.dark, x: 4, y: 5 },
    { color: colors.dark, x: 3, y: 6 },
    { color: colors.dark, x: 4, y: 6 },
  ]
  return (
    <>
      {pixels.map((p, i) => (
        <Pixel key={i} color={p.color} x={p.x} y={p.y} size={ps} />
      ))}
    </>
  )
}

function renderGrowing(colors: typeof PLANT_COLORS.succulent, ps: number, type: PlantType) {
  const extraLeaf = type === "cactus" ? colors.accent : colors.light
  const pixels: { color: string; x: number; y: number }[] = [
    { color: colors.light, x: 1, y: 1 },
    { color: colors.main, x: 2, y: 1 },
    { color: colors.light, x: 3, y: 1 },
    { color: colors.main, x: 5, y: 1 },
    { color: colors.light, x: 6, y: 1 },
    { color: colors.main, x: 2, y: 2 },
    { color: extraLeaf, x: 3, y: 2 },
    { color: colors.main, x: 4, y: 2 },
    { color: colors.main, x: 5, y: 2 },
    { color: colors.main, x: 2, y: 3 },
    { color: colors.main, x: 3, y: 3 },
    { color: colors.main, x: 4, y: 3 },
    { color: colors.dark, x: 3, y: 4 },
    { color: colors.dark, x: 4, y: 4 },
    { color: colors.dark, x: 3, y: 5 },
    { color: colors.dark, x: 4, y: 5 },
    { color: colors.dark, x: 3, y: 6 },
    { color: colors.dark, x: 4, y: 6 },
  ]
  return (
    <>
      {pixels.map((p, i) => (
        <Pixel key={i} color={p.color} x={p.x} y={p.y} size={ps} />
      ))}
    </>
  )
}

function renderMature(colors: typeof PLANT_COLORS.succulent, ps: number, type: PlantType) {
  const accent = type === "flower" ? colors.accent : colors.light
  const pixels: { color: string; x: number; y: number }[] = [
    { color: accent, x: 0, y: 0 },
    { color: colors.light, x: 1, y: 0 },
    { color: colors.main, x: 2, y: 0 },
    { color: colors.light, x: 3, y: 0 },
    { color: accent, x: 4, y: 0 },
    { color: colors.light, x: 5, y: 0 },
    { color: colors.main, x: 6, y: 0 },
    { color: accent, x: 7, y: 0 },
    { color: colors.light, x: 0, y: 1 },
    { color: colors.main, x: 1, y: 1 },
    { color: colors.main, x: 2, y: 1 },
    { color: colors.main, x: 3, y: 1 },
    { color: colors.main, x: 4, y: 1 },
    { color: colors.main, x: 5, y: 1 },
    { color: colors.light, x: 6, y: 1 },
    { color: colors.light, x: 7, y: 1 },
    { color: colors.main, x: 1, y: 2 },
    { color: colors.main, x: 2, y: 2 },
    { color: colors.main, x: 3, y: 2 },
    { color: colors.main, x: 4, y: 2 },
    { color: colors.main, x: 5, y: 2 },
    { color: colors.main, x: 6, y: 2 },
    { color: colors.dark, x: 3, y: 3 },
    { color: colors.dark, x: 4, y: 3 },
    { color: colors.dark, x: 3, y: 4 },
    { color: colors.dark, x: 4, y: 4 },
    { color: colors.dark, x: 3, y: 5 },
    { color: colors.dark, x: 4, y: 5 },
    { color: colors.dark, x: 3, y: 6 },
    { color: colors.dark, x: 4, y: 6 },
  ]
  return (
    <>
      {pixels.map((p, i) => (
        <Pixel key={i} color={p.color} x={p.x} y={p.y} size={ps} />
      ))}
    </>
  )
}

function renderBlooming(colors: typeof PLANT_COLORS.succulent, ps: number, type: PlantType) {
  const bloom = colors.accent
  const pixels: { color: string; x: number; y: number }[] = [
    { color: bloom, x: 1, y: 0 },
    { color: bloom, x: 3, y: 0 },
    { color: bloom, x: 5, y: 0 },
    { color: bloom, x: 0, y: 1 },
    { color: colors.light, x: 1, y: 1 },
    { color: colors.light, x: 2, y: 1 },
    { color: bloom, x: 3, y: 1 },
    { color: colors.light, x: 4, y: 1 },
    { color: colors.light, x: 5, y: 1 },
    { color: bloom, x: 6, y: 1 },
    { color: colors.light, x: 0, y: 2 },
    { color: colors.main, x: 1, y: 2 },
    { color: colors.main, x: 2, y: 2 },
    { color: colors.main, x: 3, y: 2 },
    { color: colors.main, x: 4, y: 2 },
    { color: colors.main, x: 5, y: 2 },
    { color: colors.light, x: 6, y: 2 },
    { color: bloom, x: 7, y: 2 },
    { color: colors.main, x: 1, y: 3 },
    { color: colors.main, x: 2, y: 3 },
    { color: colors.main, x: 3, y: 3 },
    { color: colors.main, x: 4, y: 3 },
    { color: colors.main, x: 5, y: 3 },
    { color: colors.main, x: 6, y: 3 },
    { color: colors.dark, x: 3, y: 4 },
    { color: colors.dark, x: 4, y: 4 },
    { color: colors.dark, x: 3, y: 5 },
    { color: colors.dark, x: 4, y: 5 },
    { color: colors.dark, x: 3, y: 6 },
    { color: colors.dark, x: 4, y: 6 },
    { color: bloom, x: 2, y: 4 },
    { color: bloom, x: 5, y: 4 },
  ]
  return (
    <>
      {pixels.map((p, i) => (
        <Pixel key={i} color={p.color} x={p.x} y={p.y} size={ps} />
      ))}
    </>
  )
}

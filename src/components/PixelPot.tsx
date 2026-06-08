import type { PotStyle } from "@/types"

interface PixelPotProps {
  style: PotStyle
  width?: number
}

const POT_COLORS: Record<PotStyle, { body: string; rim: string; shadow: string; highlight: string }> = {
  terracotta: { body: "#C2724E", rim: "#D4845A", shadow: "#9E5A3C", highlight: "#E09570" },
  ceramic: { body: "#F5F0E8", rim: "#FFFFFF", shadow: "#D4CFC7", highlight: "#FFFFFF" },
  glass: { body: "rgba(173,216,230,0.6)", rim: "rgba(200,230,240,0.8)", shadow: "rgba(135,206,235,0.4)", highlight: "rgba(255,255,255,0.7)" },
  wooden: { body: "#8B6F47", rim: "#A0845C", shadow: "#6B5233", highlight: "#B89E6F" },
  stone: { body: "#808080", rim: "#999999", shadow: "#5A5A5A", highlight: "#B0B0B0" },
}

export default function PixelPot({ style, width = 80 }: PixelPotProps) {
  const colors = POT_COLORS[style]
  const pixelSize = Math.floor(width / 8)

  const potPixels: { color: string; x: number; y: number }[] = [
    { color: colors.rim, x: 1, y: 0 },
    { color: colors.rim, x: 2, y: 0 },
    { color: colors.rim, x: 3, y: 0 },
    { color: colors.rim, x: 4, y: 0 },
    { color: colors.rim, x: 5, y: 0 },
    { color: colors.rim, x: 6, y: 0 },
    { color: colors.highlight, x: 1, y: 1 },
    { color: colors.body, x: 2, y: 1 },
    { color: colors.body, x: 3, y: 1 },
    { color: colors.body, x: 4, y: 1 },
    { color: colors.body, x: 5, y: 1 },
    { color: colors.shadow, x: 6, y: 1 },
    { color: colors.highlight, x: 2, y: 2 },
    { color: colors.body, x: 3, y: 2 },
    { color: colors.body, x: 4, y: 2 },
    { color: colors.shadow, x: 5, y: 2 },
    { color: colors.highlight, x: 2, y: 3 },
    { color: colors.body, x: 3, y: 3 },
    { color: colors.body, x: 4, y: 3 },
    { color: colors.shadow, x: 5, y: 3 },
    { color: colors.body, x: 3, y: 4 },
    { color: colors.body, x: 4, y: 4 },
  ]

  return (
    <div className="relative" style={{ width, height: pixelSize * 5 }}>
      {potPixels.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x * pixelSize,
            top: p.y * pixelSize,
            width: pixelSize,
            height: pixelSize,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

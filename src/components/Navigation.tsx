import { NavLink } from "react-router-dom"
import { Home, Droplets, BookOpen, Timer } from "lucide-react"

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "温室" },
  { to: "/habits", icon: Droplets, label: "习惯" },
  { to: "/focus", icon: Timer, label: "专注" },
  { to: "/collection", icon: BookOpen, label: "图鉴" },
]

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pixel-border-top" style={{ backgroundColor: "rgba(245,240,232,0.95)", backdropFilter: "blur(8px)" }}>
      <div className="max-w-4xl mx-auto flex items-center justify-around py-2 px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-green-700 bg-green-50"
                  : "text-stone-400 hover:text-green-600 hover:bg-green-50/50"
              }`
            }
          >
            <item.icon size={20} strokeWidth={2.5} />
            <span className="text-xs font-bold" style={{ fontFamily: "'ZCOOL QingKe HuangYou', cursive" }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

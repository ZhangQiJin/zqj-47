import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "@/components/Navigation"
import Greenhouse from "@/pages/Greenhouse"
import PlantDetail from "@/pages/PlantDetail"
import Habits from "@/pages/Habits"
import Focus from "@/pages/Focus"
import Collection from "@/pages/Collection"
import { useGreenhouseStore } from "@/store/greenhouse"

export default function App() {
  const resetHabitsIfNewDay = useGreenhouseStore((s) => s.resetHabitsIfNewDay)

  useEffect(() => {
    resetHabitsIfNewDay()
  }, [resetHabitsIfNewDay])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Greenhouse />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
      <Navigation />
    </Router>
  )
}

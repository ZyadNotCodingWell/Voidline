import { useEffect, useState } from "react"

export function useCrosshair(inGame: boolean) {
  const [pos, setPos] = useState({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 400,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
  })

  useEffect(() => {
    if (!inGame) return

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [inGame])

  return pos
}

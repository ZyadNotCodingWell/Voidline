import { useCallback, useEffect, useRef, useState } from "react"

export function useBullets({ inGame, ammo, powerups }: { inGame: boolean; ammo: number; powerups: any }) {
  const [bullets, setBullets] = useState<any[]>([])
  const lastShotTimeRef = useRef(0)
  const shotCooldown = 200
  const bulletSpeed = 10

  // Helper: rotate vector by degrees
  function rotateVector(x: number, y: number, degrees: number) {
    const radians = (degrees * Math.PI) / 180
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    }
  }

  const shoot = useCallback((crosshairPos: { x: number; y: number }, onAmmoUse: () => void) => {
    if (!inGame || ammo <= 0) return
    const now = Date.now()
    if (now - lastShotTimeRef.current < shotCooldown) return

    lastShotTimeRef.current = now
    onAmmoUse()

    const startX = window.innerWidth / 2
    const startY = window.innerHeight -50

    // base direction vector from start to crosshair
    let dx = crosshairPos.x - startX
    let dy = crosshairPos.y - startY
    const length = Math.sqrt(dx * dx + dy * dy)
    if (length === 0) return // avoid division by zero
    dx /= length
    dy /= length

    const bulletCount = powerups.triple ? 3 : 1
    const spreadAngle = 15 // degrees spread for triple shot

    const newBullets = Array.from({ length: bulletCount }).map((_, i) => {
      // For triple, rotate direction vector by spreadAngle * (index offset)
      // index offset: -1, 0, 1 for i=0,1,2
      let angleOffset = 0
      if (powerups.triple) {
        angleOffset = spreadAngle * (i - 1)
      }
      const dir = rotateVector(dx, dy, angleOffset)
      return {
        id: now + i + Math.floor(Math.random() * 1000),
        x: startX,
        y: startY,
        dirX: dir.x,
        dirY: dir.y,
        speed: bulletSpeed,
      }
    })

    setBullets(prev => [...prev, ...newBullets])
  }, [inGame, ammo, powerups.triple])

  useEffect(() => {
    if (!inGame) return
    const interval = setInterval(() => {
      setBullets(prev =>
        prev
          .map(b => ({
            ...b,
            x: b.x + b.dirX * b.speed,
            y: b.y + b.dirY * b.speed,
          }))
          // Remove bullets off screen (simple bounds check)
          .filter(b => b.x > -50 && b.x < window.innerWidth + 50 && b.y > -50 && b.y < window.innerHeight + 50)
      )
    }, 16)
    return () => clearInterval(interval)
  }, [inGame])

  return { bullets, setBullets, shoot }
}

import { useEffect, useRef, useState } from "react"

export interface Enemy {
  id: number
  x: number
  y: number
  health: number
  speed: number
}

export function useEnemies(inGame: boolean, onEnemyPass: () => void) {
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameId = useRef<number | null>(null)

  // Spawn enemies at regular interval
  useEffect(() => {
    if (!inGame) return

    spawnIntervalRef.current = setInterval(() => {
      const newEnemy: Enemy = {
        id: Date.now(),
        x: 24 + Math.random() * (window.innerWidth - 48),
        y: -48, // start above screen
        health: 1,
        speed: 1.25,
      }
      setEnemies(prev => [...prev, newEnemy])
    }, 2500)

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }
  }, [inGame])

  // Move enemies downward smoothly with rAF
  useEffect(() => {
    if (!inGame) return

    const moveEnemies = () => {
		  setEnemies(prev =>
		    prev.reduce<Enemy[]>((acc, enemy) => {
		      const newY = enemy.y + enemy.speed
		      if (newY > window.innerHeight) {
		        if (enemy.health > 0) {
		          onEnemyPass()
		          acc.push({ ...enemy, health: 0 }) // mark as passed by setting health to 0
		        } else {
		          acc.push(enemy) // already passed, keep as is without triggering life loss
		        }
		      } else {
		        acc.push({ ...enemy, y: newY })
		      }
		      return acc
		    }, [])
		  )
		  animationFrameId.current = requestAnimationFrame(moveEnemies)
		}


    animationFrameId.current = requestAnimationFrame(moveEnemies)

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [inGame, onEnemyPass])

  return { enemies, setEnemies }
}

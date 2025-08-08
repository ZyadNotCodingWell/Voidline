import { useEffect, useRef } from "react"

interface Enemy {
  id: number
  x: number
  y: number
  health: number
  speed: number
}

interface Bullet {
  id: number
  x: number
  y: number
}

interface Powerups {
  pierce: boolean
  triple: boolean
  bomb: boolean
}

interface UseCollisionProps {
  inGame: boolean
  bullets: Bullet[]
  setBullets: React.Dispatch<React.SetStateAction<Bullet[]>>
  enemies: Enemy[]
  setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>
  powerups: Powerups
  onScore: (inc: number) => void
  onEnemyPass?: () => void
}

export function useCollision({
  inGame,
  bullets,
  setBullets,
  enemies,
  setEnemies,
  powerups,
  onScore,
  onEnemyPass,
}: UseCollisionProps) {
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    if (!inGame) return

    const bulletWidth = 4
    const bulletHeight = 40
    const enemySize = 48

    const gameLoop = () => {
      setEnemies((prevEnemies) => {
        const updatedEnemies: Enemy[] = []
        let scoreIncrease = 0
        const enemyHitMap = new Map<number, boolean>()

        setBullets((prevBullets) => {
          const newBullets: Bullet[] = []

          for (const bullet of prevBullets) {
            let bulletHit = false

            for (const enemy of prevEnemies) {
              if (enemyHitMap.get(enemy.id)) continue

              // Calculate bounding boxes
              const bulletX = bullet.x - bulletWidth / 2
              const bulletY = bullet.y - bulletHeight / 2
              const enemyX = enemy.x - enemySize / 2
              const enemyY = enemy.y // enemy top aligned

              const overlapping =
                bulletX < enemyX + enemySize &&
                bulletX + bulletWidth > enemyX &&
                bulletY < enemyY + enemySize &&
                bulletY + bulletHeight > enemyY

              if (overlapping && enemy.health > 0) {
                bulletHit = true
                scoreIncrease += 10
                enemy.health = Math.max(0, enemy.health - 1)
                enemyHitMap.set(enemy.id, true)
                if (!powerups.pierce) break
              }
            }

            if (!bulletHit || powerups.pierce) {
              newBullets.push(bullet)
            }
          }

          if (scoreIncrease > 0) onScore(scoreIncrease)

          return newBullets
        })

        for (const enemy of prevEnemies) {
          if (!enemyHitMap.get(enemy.id)) {
            if (enemy.y > window.innerHeight) {
              if (onEnemyPass) onEnemyPass()
            } else {
              updatedEnemies.push(enemy)
            }
          }
        }

        return updatedEnemies
      })

      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    animationFrameId.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [inGame, powerups, onScore, setBullets, setEnemies, onEnemyPass])
}

import { useState, useCallback } from "react"

export function useGameState() {
  const [gameState, setGameState] = useState({
    inGame: false,
    lives: 6,
    score: 0,
    ammo: 60,
    maxAmmo: 60,
    powerups: { triple: true, bomb: false, pierce: false },
    reloading: false,  // <-- add this
    zen: false
  })

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      inGame: true,
      lives: prev.lives === 0 ? 3 : prev.lives,
      score: prev.lives === 0 ? 0 : prev.score,
      ammo: prev.lives === 0 ? 60 : prev.ammo,
      reloading: false,   // reset reload on new game start
      zen: false
    }))
  }, [])

  const togglePause = useCallback(() => {
    if (!gameState.inGame || gameState.lives === 0) return
    setGameState(prev => ({ ...prev, inGame: false }))
  }, [gameState])

  return { gameState, setGameState, startGame, togglePause }
}

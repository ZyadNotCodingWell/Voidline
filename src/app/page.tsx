"use client"

import React from "react"
import Crosshair from "@/components/Crosshair"
import GameDialog from "@/components/GameDialog"
import GameHUD from "@/components/GameHUD"

import { useGameState } from "@/hooks/useGamestate"
import { useCrosshair } from "@/hooks/useCrosshair"
import { useBullets } from "@/hooks/useBullets"
import { useEnemies } from "@/hooks/useEnemies"
import { useCollision } from "@/hooks/useCollision"
import EnemySprite from "@/components/EnemySprite"
export type PowerupType = "triple" | "bomb" | "pierce"

export default function GamePage() {
  const { gameState, setGameState, startGame, togglePause } = useGameState()
  const crosshairPos = useCrosshair(gameState.inGame)
  const { bullets, setBullets, shoot } = useBullets({
    inGame: gameState.inGame,
    ammo: gameState.ammo,
    powerups: gameState.powerups,
  })
  const { enemies, setEnemies } = useEnemies(gameState.inGame, () => {
    if (!gameState.zen) {
      setGameState(prev => ({ ...prev, lives: prev.lives - 1 }))
    }
  })
  
  const aliveEnemies = enemies.filter(e => e.health > 0)

  useCollision({
    inGame: gameState.inGame,
    bullets,
    setBullets,
    enemies,
    setEnemies,
    powerups: gameState.powerups,
    onScore: (inc: number) =>
      setGameState(prev => ({ ...prev, score: prev.score + inc })),
  })

  // Shooting listeners
  React.useEffect(() => {
    const handleShoot = (e: MouseEvent | KeyboardEvent) => {
      if (!gameState.inGame) return
      if (e instanceof MouseEvent || (e instanceof KeyboardEvent && e.code === " ")) {
        e.preventDefault()
        shoot(crosshairPos, () =>
          setGameState(prev => ({ ...prev, ammo: prev.ammo - 1 }))
        )
      }
    }

    window.addEventListener("mousedown", handleShoot)
    window.addEventListener("keydown", handleShoot)
    return () => {
      window.removeEventListener("mousedown", handleShoot)
      window.removeEventListener("keydown", handleShoot)
    }
  }, [gameState.inGame, shoot, crosshairPos])

  // Game over trigger: if lives 0, stop game
  React.useEffect(() => {
    if (gameState.lives <= 0 && gameState.inGame) {
      setGameState(prev => ({ ...prev, inGame: false }))
    }
  }, [gameState.lives, gameState.inGame])

  // Reload mechanic
  React.useEffect(() => {
    if (gameState.ammo === 0 && !gameState.reloading && gameState.inGame) {
      setGameState(prev => ({ ...prev, reloading: true }))
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          ammo: prev.maxAmmo,
          reloading: false,
        }))
      }, 2000)
    }
  }, [gameState.ammo, gameState.reloading, gameState.inGame])

  // States for dialog
  const isGameOver = !gameState.inGame && gameState.lives === 0
const isNotStarted = !gameState.inGame && gameState.lives === 6 && gameState.score === 0
const isPaused = !gameState.inGame && gameState.lives > 0 && !isNotStarted

const dialogMessage = isNotStarted
  ? "Voidline"
  : isPaused
  ? "Paused - Click to Resume"
  : isGameOver
  ? "Game Over! Replay?"
  : ""

const dialogButtonLabel = isNotStarted
  ? "Start"
  : isPaused
  ? "Resume"
  : isGameOver
  ? "Replay"
  : ""

  // Reset function on start
  const resetGame = () => {
    setEnemies([])
    setBullets([])
    setGameState({
      inGame: true,
      lives: 6,   // since you’re doing lives/2 in HUD
      score: 1,
      ammo: 60,
      maxAmmo: 60,
      powerups: { triple: false, bomb: false, pierce: false },
      reloading: false,
      zen: false
    })
  }

  const handleStart = () => {
     if (isNotStarted || isGameOver) {
       resetGame()
     } else if (isPaused) {
       setGameState(prev => ({ ...prev, inGame: true })) // just resume
     }
    }

    React.useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === "Escape") {
          if (!gameState.inGame && gameState.lives > 0) {
            // currently paused -> resume
            setGameState(prev => ({ ...prev, inGame: true }))
          } else if (gameState.inGame) {
            // currently playing -> pause
            setGameState(prev => ({ ...prev, inGame: false }))
          }
        }
      }
    
      window.addEventListener("keydown", handleKey)
      return () => window.removeEventListener("keydown", handleKey)
    }, [gameState.inGame, gameState.lives, setGameState])

    const [activePowerupMsg, setActivePowerupMsg] = React.useState<string | null>(null)
    const [inactivePowerupMsg, setInactivePowerupMsg] = React.useState<string | null>(null)

    const togglePowerup = (type: PowerupType) => {
      setGameState(prev => {
        const currentlyActive = prev.powerups[type]
        const newState = !currentlyActive
      
        if (newState) {
          // Show message ONLY if we’re activating it
          setActivePowerupMsg(type)
          setTimeout(() => setActivePowerupMsg(null), 2000)
        } else {
          setInactivePowerupMsg(type)
          setTimeout(() => setInactivePowerupMsg(null), 2000)

        }
      
        return {
          ...prev,
          powerups: {
            ...prev.powerups,
            [type]: newState,
          },
        }
      })
    }

    const toggleZen = () => {
      setGameState(prev => {
        const newZen = !prev.zen;
        return {
          ...prev,
          zen: newZen,
        };
      });
    };

    
  return (
    <main className="relative  w-full h-screen bg-transparent text-white overflow-hidden flex flex-col items-center">
      {/* Background */}
      <video autoPlay loop muted playsInline className="fixed top-0 left-0 w-screen h-screen object-cover z-0">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Crosshair */}
      <Crosshair x={crosshairPos.x} y={crosshairPos.y} />

      {/* Bullets */}
      {bullets.map(b => (
        <div
          key={b.id}
          className="fixed size-6 bg-gradient-radial from-primary to-transparent via-primary/50 border-2 border-transparent   z-40 rounded-full"
          style={{ left: b.x, top: b.y, transform: "translate(-50%, -50%)" }}
        />
      ))}

      {/* Enemies */}
      {aliveEnemies.map(e => (
        <div
          key={e.id}
          className="absolute z-30 overflow-clip rounded-full"
          style={{
            width: "52px",
            height: "52px",
            left: e.x,
            top: e.y,
            transform: "translateX(-50%)",
            boxSizing: "border-box",
            border: "2px dashed transparent", // hitbox stays for debugging
            pointerEvents: "none",
          }}
        >
          <EnemySprite
              idleSprite="/spriteSheet.png"
              idleFrames={9}
              frameSize={44}
              scale={3}
              frameDuration={112}
            />
        </div>
      ))}


      <GameDialog open={!gameState.inGame} onStart={handleStart} message={dialogMessage} buttonLabel={dialogButtonLabel} />

      {/* Optional Game Grid */}
      <div className="flex-1 grid grid-rows-6 grid-cols-12 gap-[2px] p-2"></div>

      {/* HUD */}
      <GameHUD
        lives={Math.floor(gameState.lives)}
        ammo={gameState.ammo}
        maxAmmo={gameState.maxAmmo}
        score={gameState.score > 0 ? gameState.score - 1 : 0}
        powerups={gameState.powerups}
        onPauseClick={togglePause}
        togglePowerup={togglePowerup} // <--- add this
        zen = {gameState.zen}
        toggleZen={toggleZen}

      />


      {/*  Powerup Dialog*/}
      {activePowerupMsg && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3  bg-gradient-to-r from-transparent to-transparent via-primary/15 border border-x-0 border-primary text-primary text-sm  animate-fade-in-out pointer-events-none z-50">
          Powerup Activated: {activePowerupMsg.toUpperCase()}
        </div>
      )}
      {inactivePowerupMsg && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3  bg-gradient-to-r from-transparent to-transparent via-red-600/15 border border-x-0 border-red-600 text-red-600 text-sm  animate-fade-in-out pointer-events-none z-50">
          Powerup Deactivated: {inactivePowerupMsg.toUpperCase()}
        </div>      )}

      {gameState.reloading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3  bg-gradient-to-r from-transparent to-transparent via-primary/15 border border-x-0 border-primary text-primary text-sm  animate-fade-in-out pointer-events-none z-50">
            Reloading
        </div>      )}

    </main>
  )
}

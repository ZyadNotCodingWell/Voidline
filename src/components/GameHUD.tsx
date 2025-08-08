"use client"
import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, LucideBatteryFull, Pause, Infinity as InfIcon } from "lucide-react"
import PowerupCard from "./PowerupCard"
import { PowerupType } from "@/app/page"

export default function GameHUD({
  lives = 3,
  ammo = 30,
  maxAmmo = Infinity,
  score = 0,
  powerups = { triple: false, bomb: false, pierce: false },
  onPauseClick,
  zen = false,
  toggleZen,
  togglePowerup,
}: {
  lives?: number
  ammo?: number
  maxAmmo?: number
  score?: number
  powerups?: Record<string, boolean>
  zen?: boolean
  onPauseClick?: () => void
  togglePowerup: (type: PowerupType) => void
  toggleZen?: () => void
}) {
  return (
    <Card className="cursor-default w-fit bg-primary/10 backdrop-blur-xl border-2 border-primary/20 pt-4 pb-2 px-16 flex items-center justify-between rounded-t-full rounded-b-none shadow-inner gap-4 z-50 animate-in fade-in slide-in-from-bottom duration-300">
      
      <Card
        className="bg-primary/5 px-4 py-2 text-primary border border-primary/30 shadow-sm flex cursor-pointer select-none justify-center items-center"
        onClick={toggleZen}
        title="Toggle Zen Mode"
      >
        {zen 
          ? <span className="text-lg ">zen</span>
          : (
            <>
              {Array.from({ length: lives }, (_, i) => (
                <Heart key={`full-${i}`} className="text-primary" />
              ))}
              {Array.from({ length: 3 - lives }, (_, i) => (
                <Heart key={`empty-${i}`} className="opacity-0" />
              ))}
            </>
          )
        }
      </Card>

      <Card className="bg-primary/5 px-4 py-2 text-primary border border-primary/30 shadow-sm">
        Score: {score}
      </Card>

      <Card className="bg-primary/5 flex px-4 py-2 text-primary border border-primary/30 shadow-sm">
        <LucideBatteryFull className="mr-2" /> {ammo}/{maxAmmo === Infinity ? <InfIcon /> : maxAmmo}
      </Card>

      <Card className="flex gap-4 bg-accent-foreground/30 px-1 py-0.5 text-primary border-primary/30 shadow-sm">
        {(["triple","pierce"] as const).map((type) => (
          <PowerupCard
            key={type}
            type={type}
            active={powerups[type]}
            onClick={() => togglePowerup(type)}
          />
        ))}
      </Card>

      <Button
        size="icon"
        variant="ghost"
        className="rounded-xl p-5 hover:bg-primary/10 border border-primary/50 border-b-4 hover:border-b-2"
        onClick={onPauseClick}
      >
        <Pause className="size-6 scale-150 text-primary" />
      </Button>
    </Card>
  )
}

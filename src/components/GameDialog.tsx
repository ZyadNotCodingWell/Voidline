"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, MousePointerClick, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Keyboard, SquareArrowUp, SquareArrowDown, SquareArrowLeft, SquareArrowRight, Move, Lightbulb } from "lucide-react"
import EnemySprite from "./EnemySprite"

export default function GameDialog({
  open,
  onStart,
  message = "just another browser game",
  buttonLabel = "GO!",
}: {
  open: boolean
  onStart: () => void
  message?: string
  buttonLabel?: string
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="backdrop-blur-lg rounded-none border border-x-0 border-primary/50 w-full bg-gradient-to-r from-transparent to-transparent via-primary/10">
        <DialogHeader>
          <DialogTitle className="text-lg text-primary font-bold text-center items-center justify-center flex flex-row">
            {message === "Game Over! Replay?" &&           
                <div className="size-12 overflow-hidden mx-2">
                  <EnemySprite
                        idleSprite="/spriteSheet.png"
                        idleFrames={9}
                        frameSize={44}
                        scale={3}
                        frameDuration={112}
                  />
                </div>
                   }
                  {message}
            {message === "Game Over! Replay?" &&           
                <div className="size-12 overflow-hidden mx-2">
                  <EnemySprite
                        idleSprite="/spriteSheet.png"
                        idleFrames={9}
                        frameSize={44}
                        scale={3}
                        frameDuration={112}
                  />
                </div>
                   }
          </DialogTitle>
          <DialogDescription className="text-center text-primary/70 mt-2 grid grid-cols-2 gap-x-0 gap-y-4 justify-center text-xs py-4">
            <div className="flex items-center border-x border-x-primary/50 px-2 gap-1 col-span-1 justify-center">
              <MousePointerClick className="w-4 h-4 mr-4" /> Shoot
            </div>
            <div className="flex items-center border-x border-x-primary/50 px-2 gap-1 col-span-1 justify-center">
              [esc] Pause
            </div>
            <div className="flex items-center border-x border-x-primary/50 px-2 gap-1 col-span-2 justify-center">
              <Move   className="size-4 mr-4" />
              Move
            </div>
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          onClick={onStart}
          className="bg-transparent border border-primary/50 text-primary hover:bg-primary/0 hover:text-accent transition-colors w-fit self-center mx-auto rounded-sm"
        >
          {buttonLabel}
        </Button>
        {message === "Game Over! Replay?" && (
          <a href="/" className="text-center text-primary/50 text-xs flex justify-center ">
            Check my profile <Heart className="ml-2 w-4 h-4 -translate-y-0.5" />
          </a>
        )}
        {message === "Paused - Click to Resume" && (
          <a href="/" className="text-center text-primary/70 text-xs flex text-nowrap mt-4 ">
            <Lightbulb className=" w-4 h-4 mr-2 -translate-y-0.5 text-nowrap" /> Click on the hearts to go zen mode
          </a>
        )}
      </DialogContent>
    </Dialog>
  )
}

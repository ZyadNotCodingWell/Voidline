"use client"
import React from "react"
import clsx from "clsx"
import { LucideTally3, Bomb, SquareArrowUpRight } from "lucide-react"

type PowerupType = "triple" | "bomb" | "pierce"

export default function PowerupCard({
  type,
  active,
  onClick,
}: {
  type: PowerupType
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "w-10 h-10 flex items-center justify-center text-2xl transition duration-300 border border-primary/40 rounded-lg cursor-pointer select-none",
        active
          ? "text-primary bg-primary/5 border-b-4 border-x-2 hover:border-b-2 hover:border-x"
          : "text-primary bg-primary/5 grayscale opacity-50 border-b-4 border-x-2 hover:border-b-2 hover:border-x"
      )}
    >
      {type === "triple" && <LucideTally3 className="size-6 translate-x-[3px] rotate-45 translate-y-[2px]" />}
      {type === "bomb" && <Bomb className="size-6" />}
      {type === "pierce" && <SquareArrowUpRight className="size-6" />}
    </div>
  )
}

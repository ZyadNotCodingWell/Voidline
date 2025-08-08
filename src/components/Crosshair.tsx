"use client"
import React from "react"
import { Plus } from "lucide-react"

export default function Crosshair({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed z-50  cursor-none"
      style={{ top: y, left: x, transform: "translate(-50%, -50%)" }}
    >
      <div className="r py-2 px-4 border-2 border-y-0 border-red-500/50 rounded-full">
        <div className="rounded-tr-full rounded-bl-full p-0 border-2 border-y-0 border-red-500/50 rotate-45">
          <div className="relative border-2 border-x-0 border-red-500/50 rounded-tl-full rounded-br-full  flex items-center justify-center">
            <Plus className="w-8 h-8 text-red-500 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  )
} 
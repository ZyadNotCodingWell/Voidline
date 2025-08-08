"use client"
import React from "react"
import { Plus } from "lucide-react"

export default function Crosshair({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ top: y, left: x, transform: "translate(-50%, -50%)" }}
    >
      <div className="rounded-lg py-2 px-4 border-2 border-y-0 border-primary/50">
        <div className="rounded-tr-lg rounded-bl-lg p-0 border-2 border-y-0 border-primary/50 rotate-45">
          <div className="relative border-2 border-x-0 border-primary/50 rounded-tl-lg rounded-br-lg flex items-center justify-center">
            <Plus className="w-8 h-8 text-primary/50 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  )
} 
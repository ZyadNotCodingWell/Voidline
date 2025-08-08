"use client"
import React, { useState, useEffect } from "react"

export default function EnemySprite({
  frameSize = 16,
  scale = 3,
  idleSprite = "/sprites/enemy_idle.png",
  idleFrames = 4,
  frameDuration = 100,
}) {
  const [frame, setFrame] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  useEffect(() => {
    const sprite = setInterval(() => {
      setFrame((prev) => {
        let next = prev + direction
        if (next >= idleFrames - 1) {
          setDirection(-1)
          return idleFrames - 1
        }
        if (next <= 0) {
          setDirection(1)
          return 0
        }
        return next
      })
    }, frameDuration)

    return () => clearInterval(sprite)
  }, [direction, idleFrames, frameDuration])

  return (
    <div
      style={{
        width: `${frameSize * scale}px`,
        height: `${frameSize * scale}px`,
        backgroundImage: `url(${idleSprite})`,
        backgroundPosition: `-${frame * frameSize}px 0px`,
        backgroundSize: `${frameSize * idleFrames}px auto`,
        imageRendering: "pixelated",
        transform: `translateX(1%)`,
      }}
    />
  )
}

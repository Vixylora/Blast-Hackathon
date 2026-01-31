"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { cn } from "./utils"

export interface GlitchBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Base color */
  color?: string
  /** Glitch intensity (0.5-2) */
  intensity?: number
  /** Show scanlines */
  scanlines?: boolean
}

export function GlitchBackground({
  className,
  children,
  color = "#00ffff",
  intensity = 1,
  scanlines = true,
}: GlitchBackgroundProps) {
  const [glitchState, setGlitchState] = useState({
    offsetX1: 0,
    offsetX2: 0,
    sliceY: 0,
    sliceHeight: 0,
    sliceOffset: 0,
    noiseOpacity: 0,
    isGlitching: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number | null = null
    let timeoutId: number | null = null
    
    const scheduleNextGlitch = () => {
      // Schedule the next glitch to occur in 30-60 seconds
      const delay = 30000 + Math.random() * 30000
      timeoutId = window.setTimeout(() => {
        startGlitch()
      }, delay)
    }

    const startGlitch = () => {
      const glitchDuration = 100 + Math.random() * 200 * intensity
      const startTime = performance.now()
      let frameCount = 0
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        
        if (elapsed < glitchDuration) {
          // Only update every 3rd frame for performance
          frameCount++
          if (frameCount % 3 === 0) {
            const glitchIntensity = intensity * (Math.random() * 0.5 + 0.5)
            
            setGlitchState({
              offsetX1: (Math.random() - 0.5) * 25 * glitchIntensity,
              offsetX2: (Math.random() - 0.5) * 25 * glitchIntensity,
              sliceY: Math.random() * 100,
              sliceHeight: 2 + Math.random() * 10,
              sliceOffset: (Math.random() - 0.5) * 40 * glitchIntensity,
              noiseOpacity: 0.12 + Math.random() * 0.18 * glitchIntensity,
              isGlitching: true,
            })
          }
          
          animationId = requestAnimationFrame(animate)
        } else {
          // Glitch finished, reset to calm state
          setGlitchState({
            offsetX1: 0,
            offsetX2: 0,
            sliceY: 0,
            sliceHeight: 0,
            sliceOffset: 0,
            noiseOpacity: 0.02,
            isGlitching: false,
          })
          animationId = null
          // Schedule next glitch
          scheduleNextGlitch()
        }
      }
      
      animationId = requestAnimationFrame(animate)
    }

    // Start the first glitch cycle
    scheduleNextGlitch()

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [intensity])

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden bg-black", className)}
    >
      {/* Base layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, ${color}15 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, ${color}10 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a12 100%)
          `,
        }}
      />

      {/* RGB Split layers */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}20 0%, transparent 60%)`,
          transform: `translateX(${glitchState.offsetX1}px)`,
          opacity: 0.8,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, #ff000018 0%, transparent 60%)`,
          transform: `translateX(${-glitchState.offsetX2}px)`,
          opacity: 0.6,
        }}
      />

      {/* Horizontal slice glitch */}
      {glitchState.isGlitching && glitchState.sliceHeight > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            top: `${glitchState.sliceY}%`,
            height: `${glitchState.sliceHeight}%`,
            background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
            transform: `translateX(${glitchState.sliceOffset}px)`,
            boxShadow: `0 0 10px ${color}50`,
          }}
        />
      )}

      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: glitchState.noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scanlines */}
      {scanlines && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            opacity: 0.5,
          }}
        />
      )}

      {/* Glitch flash */}
      {glitchState.isGlitching && Math.random() > 0.7 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: color,
            opacity: 0.03,
          }}
        />
      )}

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

// Legacy export for backward compatibility
export function Glitch({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <GlitchBackground className={className} color="#00e3ff" intensity={1.2} {...props} />
}
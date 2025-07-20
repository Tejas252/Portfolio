"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    setIsAnimating(true)

    // Create the theme transition effect
    const newTheme = theme === "light" ? "dark" : "light"

    // Add the transition overlay
    const overlay = document.createElement("div")
    overlay.className = "theme-transition-overlay"
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-radius: 50%;
      z-index: 9999;
      pointer-events: none;
      transform-origin: top right;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `
    //   background: ${newTheme === "dark" ? "radial-gradient(circle, #1a1a1a 0%, #000000 10%)" : "radial-gradient(circle, #ffffff 0%, #f8f9fa 10%)"};

    document.body.appendChild(overlay)

    // Trigger the animation
    requestAnimationFrame(() => {
      const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
      overlay.style.width = `${diagonal * 2}px`
      overlay.style.height = `${diagonal * 2}px`
      overlay.style.transform = "translate(-50%, -50%)"
      overlay.style.top = "0"
      overlay.style.right = "0"
    })

    // Change theme after a short delay
    setTimeout(() => {
      setTheme(newTheme)
    },200)

    // Clean up
    setTimeout(() => {
      setIsAnimating(false)
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
    }, 800)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      disabled={isAnimating}
      className="relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-md"
        animate={{
          background:
            theme === "light"
              ? "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Sun Icon */}
      <AnimatePresence mode="wait">
        {theme === "light" && (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moon Icon */}
      <AnimatePresence mode="wait">
        {theme === "dark" && (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-md"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={isAnimating ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 0.5 }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            theme === "light"
              ? "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Sparkle effects */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: theme === "light" ? "#8b5cf6" : "#fbbf24",
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 40],
                  y: [0, (Math.random() - 0.5) * 40],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </Button>
  )
}

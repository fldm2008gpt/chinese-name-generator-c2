"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
  className?: string
}

export function TypewriterText({ 
  text, 
  speed = 100, 
  delay = 0, 
  onComplete, 
  className = "" 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setIsStarted(true)
      }, delay)
      return () => clearTimeout(delayTimer)
    } else {
      setIsStarted(true)
    }
  }, [delay])

  useEffect(() => {
    if (!isStarted || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete()
      }
      return
    }

    const timer = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, isStarted, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
    setIsStarted(false)
  }, [text])

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </span>
  )
}


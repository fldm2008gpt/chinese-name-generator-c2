"use client"

import { Button } from "@/components/ui/button"
import { NameCard } from "@/components/name-card"
import { RotateCcw } from "lucide-react"
import { useState } from "react"

interface ChineseName {
  chinese: string
  pinyin: string
  meaning: string
}

interface NameResultProps {
  names: ChineseName[]
  onReset: () => void
}

export function NameResults({ names, onReset }: NameResultProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (index: number) => {
    const result = names[index]
    const text = `${result.chinese} (${result.pinyin})\n${result.meaning}`
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Show fallback message if no names provided
  if (!names || names.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">暂无生成结果</h2>
        <p className="text-muted-foreground">请重新尝试生成名字</p>
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          返回表单
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Page Title with Animation */}
      <div className="text-center space-y-3 animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">你的专属中文名</h2>
        <p className="text-muted-foreground text-lg">为你精心定制的地道中文名字</p>
      </div>

      {/* Results Grid with Staggered Animation */}
      <div className="grid gap-5 md:gap-6">
        {names.map((result, index) => (
          <NameCard
            key={index}
            name={result}
            index={index}
            delay={index * 800} // 每个卡片延迟800ms出现
            onCopy={handleCopy}
            isCopied={copiedIndex === index}
          />
        ))}
      </div>

      {/* Generate Again Button with Delayed Animation */}
      <div className="flex justify-center pt-6 animate-in fade-in slide-in-from-bottom duration-500" 
           style={{ animationDelay: `${names.length * 800 + 2000}ms`, animationFillMode: 'forwards', opacity: 0 }}>
        <Button
          variant="secondary"
          size="lg"
          onClick={onReset}
          className="h-12 px-8 bg-secondary hover:bg-secondary/80 text-foreground font-semibold transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重新生成名字
        </Button>
      </div>
    </div>
  )
}

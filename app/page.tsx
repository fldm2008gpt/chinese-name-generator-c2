"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { NameForm } from "@/components/name-form"
import { NameResults } from "@/components/name-results"
import { LoadingNames } from "@/components/loading-names"
import { Sparkles, Zap, Globe, Shield } from "lucide-react"

interface ChineseName {
  chinese: string
  pinyin: string
  meaning: string
}

interface GenerateNamesRequest {
  englishName: string
  personalityTags: string[]
  style: 'modern' | 'traditional'
  nameLength: '2' | '3'
}

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [generatedNames, setGeneratedNames] = useState<ChineseName[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (formData: GenerateNamesRequest) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '生成名字失败')
      }

      const data = await response.json()
      setGeneratedNames(data.names)
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成名字时出现错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setShowResults(false)
    setGeneratedNames([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
          <div className="text-center mb-12 md:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI 智能中文起名工具1.5</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              发现属于你的
              <br />
              <span className="text-primary">完美中文名</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed">
              根据你的个性特点生成地道的中文名字。采用先进的 AI 技术，几秒钟内为你提供富有文化内涵的名字。
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-foreground">即时生成</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-foreground">文化地道</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-foreground">个性化定制</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {!showResults && !isLoading && (
            <NameForm 
              onGenerate={handleGenerate} 
              isLoading={isLoading}
              error={error}
            />
          )}
          
          {isLoading && <LoadingNames />}
          
          {showResults && !isLoading && (
            <NameResults 
              names={generatedNames}
              onReset={handleReset} 
            />
          )}

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <span>采用先进 AI 技术驱动</span>
              <div className="h-1 w-1 rounded-full bg-primary" />
              <span>全球 10,000+ 用户信赖</span>
              <div className="h-1 w-1 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

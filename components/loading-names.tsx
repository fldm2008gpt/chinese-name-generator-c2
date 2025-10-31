"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function LoadingNames() {
  return (
    <div className="space-y-8">
      {/* Loading Title */}
      <div className="text-center space-y-3 animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">正在为你生成专属中文名</h2>
        <p className="text-muted-foreground text-lg">AI 正在精心挑选最适合你的名字...</p>
      </div>

      {/* Loading Cards */}
      <div className="grid gap-5 md:gap-6">
        {[0, 1, 2].map((index) => (
          <Card
            key={index}
            className="p-6 md:p-8 shadow-2xl border border-border/50 bg-card/50 backdrop-blur animate-in fade-in slide-in-from-bottom-4"
            style={{ 
              animationDelay: `${index * 200}ms`, 
              animationFillMode: 'forwards' 
            }}
          >
            <div className="space-y-5">
              {/* Animated Chinese Characters Placeholder */}
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3 min-h-[4rem] flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div 
                      className="w-16 h-16 bg-primary/20 rounded-lg animate-pulse"
                      style={{ animationDelay: `${index * 200 + 0}ms` }}
                    />
                    <div 
                      className="w-16 h-16 bg-primary/20 rounded-lg animate-pulse"
                      style={{ animationDelay: `${index * 200 + 100}ms` }}
                    />
                  </div>
                </div>
                
                {/* Pinyin Placeholder */}
                <div className="text-xl md:text-2xl text-muted-foreground font-medium min-h-[2rem] flex items-center justify-center">
                  <div 
                    className="w-32 h-6 bg-muted/30 rounded animate-pulse"
                    style={{ animationDelay: `${index * 200 + 200}ms` }}
                  />
                </div>
              </div>

              {/* Meaning Placeholder */}
              <div className="pt-5 border-t border-border/50">
                <div className="space-y-2">
                  <div 
                    className="w-full h-4 bg-muted/20 rounded animate-pulse"
                    style={{ animationDelay: `${index * 200 + 300}ms` }}
                  />
                  <div 
                    className="w-3/4 h-4 bg-muted/20 rounded animate-pulse"
                    style={{ animationDelay: `${index * 200 + 400}ms` }}
                  />
                </div>
              </div>

              {/* Button Placeholder */}
              <div 
                className="w-full h-12 bg-secondary/30 rounded-lg animate-pulse"
                style={{ animationDelay: `${index * 200 + 500}ms` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex justify-center items-center space-x-3 animate-in fade-in duration-1000" style={{ animationDelay: '600ms' }}>
        <Sparkles className="w-5 h-5 text-primary animate-spin" />
        <span className="text-muted-foreground">AI 正在思考中...</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}


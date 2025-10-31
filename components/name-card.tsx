"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"

interface ChineseName {
  chinese: string
  pinyin: string
  meaning: string
}

interface NameCardProps {
  name: ChineseName
  index: number
  delay: number
  onCopy: (index: number) => void
  isCopied: boolean
}

export function NameCard({ name, index, delay, onCopy, isCopied }: NameCardProps) {
  return (
    <Card 
      className="relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              {name.chinese}
            </h3>
            <p className="text-lg text-muted-foreground font-medium">
              {name.pinyin}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(index)}
            className="shrink-0 h-9 w-9 p-0"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {name.meaning}
        </p>
      </CardContent>
      
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
    </Card>
  )
}

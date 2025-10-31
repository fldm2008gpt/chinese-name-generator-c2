"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2, AlertCircle, Bot, Zap } from "lucide-react"

const personalityTags = ["有创意", "沉稳", "活力", "睿智", "友善", "进取", "温柔", "果敢", "深思", "开朗"]

interface GenerateNamesRequest {
  englishName: string
  personalityTags: string[]
  style: 'modern' | 'traditional'
  nameLength: '2' | '3'
  aiProvider: 'deepseek' | 'gemini'
}

interface NameFormProps {
  onGenerate: (formData: GenerateNamesRequest) => void
  isLoading?: boolean
  error?: string | null
}

export function NameForm({ onGenerate, isLoading = false, error }: NameFormProps) {
  const [englishName, setEnglishName] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [style, setStyle] = useState<'modern' | 'traditional'>("modern")
  const [nameLength, setNameLength] = useState<'2' | '3'>("2")
  const [aiProvider, setAiProvider] = useState<'deepseek' | 'gemini'>("deepseek")

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({
      englishName,
      personalityTags: selectedTags,
      style,
      nameLength,
      aiProvider
    })
  }

  return (
    <Card className="p-6 md:p-10 shadow-2xl border border-border/50 bg-card/50 backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}
        {/* English Name */}
        <div className="space-y-3">
          <Label htmlFor="englishName" className="text-base font-semibold text-foreground">
            你的英文名 <span className="text-primary">*</span>
          </Label>
          <Input
            id="englishName"
            placeholder="例如：Sarah, Michael, Emma"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            maxLength={20}
            required
            className="h-12 text-base bg-input border-border/50 focus:border-primary"
          />
        </div>

        {/* AI Provider Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            AI 模型选择 <span className="text-muted-foreground text-sm font-normal">(对比不同AI的效果)</span>
          </Label>
          <Select value={aiProvider} onValueChange={setAiProvider}>
            <SelectTrigger className="h-12 text-base bg-input border-border/50 focus:border-primary">
              <SelectValue placeholder="选择AI模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deepseek">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span>DeepSeek (QwQ-32B)</span>
                    <span className="text-xs text-muted-foreground">深度推理，较慢但质量高</span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="gemini">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <div className="flex flex-col">
                    <span>Gemini 2.5 Flash</span>
                    <span className="text-xs text-muted-foreground">快速响应，效率优先</span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Personality Tags */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            性格特征 <span className="text-muted-foreground text-sm font-normal">(选择 1-3 个)</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {personalityTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Style Preference */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">名字风格</Label>
          <RadioGroup value={style} onValueChange={setStyle} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="modern" id="modern" />
              <Label htmlFor="modern" className="font-normal cursor-pointer text-foreground">
                现代风格
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="traditional" id="traditional" />
              <Label htmlFor="traditional" className="font-normal cursor-pointer text-foreground">
                传统风格
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Name Length */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">名字字数</Label>
          <RadioGroup value={nameLength} onValueChange={setNameLength} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="two" />
              <Label htmlFor="two" className="font-normal cursor-pointer text-foreground">
                两个字
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="three" />
              <Label htmlFor="three" className="font-normal cursor-pointer text-foreground">
                三个字
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          disabled={!englishName || selectedTags.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              正在生成中文名...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              生成我的中文名
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}

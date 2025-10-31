import { NextRequest, NextResponse } from 'next/server'

interface GenerateNamesRequest {
  englishName: string
  personalityTags: string[]
  style: 'modern' | 'traditional'
  nameLength: '2' | '3'
  aiProvider: 'deepseek' | 'gemini'
}

interface ChineseName {
  chinese: string
  pinyin: string
  meaning: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateNamesRequest = await request.json()
    const { englishName, personalityTags, style, nameLength, aiProvider = 'deepseek' } = body

    // Validate input
    if (!englishName || !personalityTags || personalityTags.length === 0) {
      return NextResponse.json(
        { error: '请提供英文名和性格特征' },
        { status: 400 }
      )
    }

    // Create prompt for Chinese name generation
    const prompt = createNameGenerationPrompt(englishName, personalityTags, style, nameLength)

    let aiResponse: string
    
    if (aiProvider === 'gemini') {
      aiResponse = await callGeminiAPI(prompt)
    } else {
      aiResponse = await callDeepSeekAPI(prompt)
    }

    // Parse AI response to extract Chinese names
    const names = parseAIResponse(aiResponse)
    console.log('解析后的名字:', names)

    return NextResponse.json({ names, provider: aiProvider })

  } catch (error) {
    console.error('生成中文名字时出错:', error)
    console.error('错误堆栈:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: '生成名字时出现错误，请稍后重试' },
      { status: 500 }
    )
  }
}

function createNameGenerationPrompt(
  englishName: string,
  personalityTags: string[],
  style: string,
  nameLength: string
): string {
  const styleDescription = style === 'modern' ? '现代风格，简洁时尚' : '传统风格，文化底蕴深厚'
  const lengthDescription = nameLength === '2' ? '两个字' : '三个字'
  
  return `请为一个叫"${englishName}"的人生成3个地道的中文名字。

要求：
- 名字长度：${lengthDescription}
- 风格：${styleDescription}
- 性格特征：${personalityTags.join('、')}
- 每个名字都要有文化内涵和美好寓意
- 适合现代人使用，读音优美

请按照以下JSON格式返回，不要包含任何其他文字。每个名字的含义解释要详细，包含字义分析和文化寓意：

[
  {
    "chinese": "思雅",
    "pinyin": "Sī Yǎ", 
    "meaning": "思：思考、思维，代表智慧和深度；雅：优雅、高雅，象征品味和气质。整体寓意：思考深刻，举止优雅，体现智慧与气质的完美结合，适合有创意且沉稳的人。"
  },
  {
    "chinese": "晨悦",
    "pinyin": "Chén Yuè",
    "meaning": "晨：清晨、朝阳，象征新的开始和希望；悦：快乐、愉悦，代表积极的心态。整体寓意：如晨光般温暖明亮，带给人快乐和正能量，象征着积极向上的人生态度和活力四射的性格。"
  },
  {
    "chinese": "文心",
    "pinyin": "Wén Xīn", 
    "meaning": "文：文化、文采，代表学识和修养；心：内心、心灵，象征纯净和真诚。整体寓意：文采斐然，内心纯净，代表对文化艺术的热爱与追求，适合有创意且深思的人。"
  }
]`
}

async function callDeepSeekAPI(prompt: string): Promise<string> {
  // Get API configuration from environment variables
  const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-lwiqcbqmjalwkeaneykkwpzvjboihkfnuugqwukcpxwkegfr'
  const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.siliconflow.cn/v1/chat/completions'
  const model = process.env.DEEPSEEK_MODEL || 'Qwen/QwQ-32B'

  // Debug logging
  console.log('DeepSeek API 调用:')
  console.log('API Key exists:', !!apiKey)
  console.log('API URL:', apiUrl)
  console.log('Model:', model)

  if (!apiKey) {
    console.error('DeepSeek API密钥未配置')
    throw new Error('DeepSeek API密钥未配置')
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`DeepSeek API调用失败: ${response.status}`, errorText)
    throw new Error(`DeepSeek API调用失败: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  console.log('DeepSeek API响应数据:', JSON.stringify(data, null, 2))
  
  const aiResponse = data.choices[0]?.message?.content

  if (!aiResponse) {
    console.error('DeepSeek API返回数据格式错误:', data)
    throw new Error('DeepSeek API返回数据格式错误')
  }

  return aiResponse
}

async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  const apiUrl = process.env.GEMINI_API_URL || 'https://openrouter.ai/api/v1/chat/completions'
  const model = process.env.GEMINI_MODEL || 'google/gemini-2.5-flash'

  console.log('Gemini API 调用 (via OpenRouter):')
  console.log('API Key exists:', !!apiKey)
  console.log('API URL:', apiUrl)
  console.log('Model:', model)

  if (!apiKey) {
    console.error('Gemini API密钥未配置')
    throw new Error('Gemini API密钥未配置，请在环境变量中设置 GEMINI_API_KEY')
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://chinese-name-generator.com', // Optional: for OpenRouter analytics
      'X-Title': 'Chinese Name Generator', // Optional: for OpenRouter analytics
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Gemini API调用失败: ${response.status}`, errorText)
    throw new Error(`Gemini API调用失败: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  console.log('Gemini API响应数据:', JSON.stringify(data, null, 2))
  
  const aiResponse = data.choices?.[0]?.message?.content

  if (!aiResponse) {
    console.error('Gemini API返回数据格式错误:', data)
    throw new Error('Gemini API返回数据格式错误')
  }

  return aiResponse
}

function parseAIResponse(response: string): ChineseName[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const jsonStr = jsonMatch[0]
      const parsed = JSON.parse(jsonStr)
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(name => 
          name.chinese && name.pinyin && name.meaning
        ).slice(0, 3) // Ensure we only return up to 3 names
      }
    }
    
    // If JSON parsing fails, return fallback names
    throw new Error('无法解析AI响应')
    
  } catch (error) {
    console.error('解析AI响应时出错:', error)
    
    // Return fallback names if parsing fails
    return [
      {
        chinese: "思雅",
        pinyin: "Sī Yǎ",
        meaning: "思：思考、思维，代表智慧和深度；雅：优雅、高雅，象征品味和气质。整体寓意：思考深刻，举止优雅，体现智慧与气质的完美结合，适合有创意且沉稳的人。"
      },
      {
        chinese: "晨悦", 
        pinyin: "Chén Yuè",
        meaning: "晨：清晨、朝阳，象征新的开始和希望；悦：快乐、愉悦，代表积极的心态。整体寓意：如晨光般温暖明亮，带给人快乐和正能量，象征着积极向上的人生态度和活力四射的性格。"
      },
      {
        chinese: "文心",
        pinyin: "Wén Xīn",
        meaning: "文：文化、文采，代表学识和修养；心：内心、心灵，象征纯净和真诚。整体寓意：文采斐然，内心纯净，代表对文化艺术的热爱与追求，适合有创意且深思的人。"
      }
    ]
  }
}

# DeepSeek API 集成设置指南

## 🚀 快速开始

### 1. 获取 API 密钥
- 访问 [SiliconFlow](https://api.siliconflow.cn/) 获取你的 API 密钥
- 或者使用其他支持 OpenAI 格式的 DeepSeek API 提供商

### 2. 配置环境变量
1. 复制 `env.example` 文件为 `.env.local`：
   ```bash
   cp env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的真实 API 信息：
   ```env
   DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   DEEPSEEK_API_URL=https://api.siliconflow.cn/v1/chat/completions
   DEEPSEEK_MODEL=Qwen/QwQ-32B
   ```

### 3. 重启开发服务器
```bash
pnpm dev
```

## 🔧 API 配置说明

### 支持的模型
- `Qwen/QwQ-32B` - 推荐，智能推理能力强
- `deepseek-chat` - DeepSeek 官方模型
- 其他兼容 OpenAI 格式的模型

### API 端点配置
- **SiliconFlow**: `https://api.siliconflow.cn/v1/chat/completions`
- **DeepSeek 官方**: `https://api.deepseek.com/v1/chat/completions`
- **其他提供商**: 根据提供商文档配置

## 🎯 功能特点

### AI 智能起名
- 根据英文名、性格特征生成中文名
- 支持现代风格和传统风格
- 支持2字名和3字名
- 每次生成3个精选名字

### 用户体验
- 实时加载状态显示
- 错误处理和重试机制
- 一键复制名字和含义
- 响应式设计

## 🛠 技术实现

### API 路由
- 位置: `app/api/generate-names/route.ts`
- 方法: POST
- 请求格式:
  ```json
  {
    "englishName": "Sarah",
    "personalityTags": ["有创意", "沉稳", "活力"],
    "style": "modern",
    "nameLength": "2"
  }
  ```

### 响应格式
```json
{
  "names": [
    {
      "chinese": "思雅",
      "pinyin": "Sī Yǎ",
      "meaning": "思考深刻，举止优雅，体现智慧与气质的完美结合"
    }
  ]
}
```

## 🔍 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查 `.env.local` 文件中的密钥是否正确
   - 确保密钥有足够的配额

2. **网络连接问题**
   - 检查网络连接
   - 尝试更换 API 端点

3. **模型不支持**
   - 确认使用的模型在 API 提供商处可用
   - 尝试使用推荐的模型

### 调试模式
在开发环境中，API 错误会在浏览器控制台显示详细信息。

## 📝 自定义配置

### 修改 Prompt
编辑 `app/api/generate-names/route.ts` 中的 `createNameGenerationPrompt` 函数来自定义 AI 提示词。

### 调整 API 参数
在 API 调用中可以调整：
- `temperature`: 控制创意程度 (0-1)
- `max_tokens`: 最大响应长度
- `model`: 使用的 AI 模型

## 🎉 完成！

配置完成后，你的中文起名工具就可以使用真实的 AI 功能了！



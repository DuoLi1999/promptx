import { getAuthUser } from "@/lib/auth/middleware";
import { optimizePromptSchema } from "@/lib/validations/optimizer";
import { unauthorized, validationError, serverError } from "@/lib/api/responses";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一位专业的 AI 提示词工程专家。你的任务是根据用户提供的意图，生成一个结构化、高质量的提示词。

## 优化原则

1. **明确角色设定**：为 AI 设定一个具体的专业角色，明确其专业领域和能力边界。

2. **具体任务描述**：将用户的模糊意图转化为清晰、可执行的任务指令。

3. **输出格式规范**：根据任务类型，指定合适的输出格式（列表、段落、表格、代码等）。

4. **上下文信息补充**：添加必要的背景信息和约束条件，帮助 AI 更好地理解任务。

5. **示例引导**：在适当情况下提供输入输出示例，让 AI 明确期望的结果。

6. **边界设定**：明确 AI 应该做什么、不应该做什么，避免偏离主题。

## 输出格式

直接输出优化后的提示词，使用 Markdown 格式组织内容。结构通常包含：
- 角色定义
- 任务描述
- 具体要求
- 输出格式
- 注意事项（如有必要）

不要添加任何解释性文字，直接给出可以使用的提示词。`;

function getTargetModelHint(targetModel: string): string {
  switch (targetModel) {
    case "chatgpt":
      return "针对 ChatGPT 优化，可以利用其强大的对话和创意能力。";
    case "claude":
      return "针对 Claude 优化，可以利用其深度分析和长文本处理能力。";
    case "deepseek":
      return "针对 DeepSeek 优化，可以利用其代码和推理能力。";
    default:
      return "生成通用提示词，适用于主流 AI 模型。";
  }
}

function getLanguageHint(language: string): string {
  return language === "en"
    ? "Please generate the optimized prompt in English."
    : "请使用中文生成优化后的提示词。";
}

export async function POST(request: Request) {
  try {
    // 验证用户身份
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    // 解析和验证请求体
    const body = await request.json();
    const parseResult = optimizePromptSchema.safeParse(body);

    if (!parseResult.success) {
      return validationError(parseResult.error.flatten().fieldErrors);
    }

    const { intention, targetModel, language } = parseResult.data;

    // 检查 API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "your-deepseek-api-key") {
      return serverError("DeepSeek API Key 未配置");
    }

    // 构建用户消息
    const userMessage = `## 用户意图
${intention}

## 优化要求
- ${getTargetModelHint(targetModel!)}
- ${getLanguageHint(language!)}

请根据以上意图生成一个专业、实用的提示词。`;

    // 调用 DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      return serverError("AI 服务暂时不可用，请稍后重试");
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
              if (!trimmedLine.startsWith("data: ")) continue;

              try {
                const json = JSON.parse(trimmedLine.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Optimizer API error:", error);
    return serverError("服务器错误，请稍后重试");
  }
}

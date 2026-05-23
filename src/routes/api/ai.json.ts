import { createFileRoute } from "@tanstack/react-router";

// POST /api/ai/json — gọi AI Gateway với tool-calling để lấy structured JSON
export const Route = createFileRoute("/api/ai/json")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { system, prompt, tool, model } = (await request.json()) as {
            system?: string;
            prompt: string;
            tool: { name: string; description: string; parameters: unknown };
            model?: string;
          };

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return Response.json(
              { error: "LOVABLE_API_KEY chưa được cấu hình" },
              { status: 500 },
            );
          }

          const messages: { role: "system" | "user"; content: string }[] = [];
          if (system) messages.push({ role: "system", content: system });
          messages.push({ role: "user", content: prompt });

          const upstream = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: model ?? "google/gemini-3-flash-preview",
                messages,
                tools: [
                  {
                    type: "function",
                    function: {
                      name: tool.name,
                      description: tool.description,
                      parameters: tool.parameters,
                    },
                  },
                ],
                tool_choice: {
                  type: "function",
                  function: { name: tool.name },
                },
              }),
            },
          );

          if (!upstream.ok) {
            if (upstream.status === 429) {
              return Response.json(
                { error: "Quá nhiều yêu cầu, vui lòng thử lại sau ít phút." },
                { status: 429 },
              );
            }
            if (upstream.status === 402) {
              return Response.json(
                { error: "Đã hết credits AI, vui lòng nạp thêm." },
                { status: 402 },
              );
            }
            const txt = await upstream.text();
            console.error("AI gateway error:", upstream.status, txt);
            return Response.json(
              { error: "Lỗi từ AI gateway" },
              { status: 500 },
            );
          }

          const data = (await upstream.json()) as {
            choices?: {
              message?: {
                tool_calls?: { function?: { arguments?: string } }[];
              };
            }[];
          };
          const argsStr =
            data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
            "{}";
          let parsed: unknown = {};
          try {
            parsed = JSON.parse(argsStr);
          } catch {
            parsed = { raw: argsStr };
          }
          return Response.json({ data: parsed });
        } catch (e) {
          console.error("ai.json error", e);
          return Response.json(
            { error: e instanceof Error ? e.message : "Lỗi không xác định" },
            { status: 500 },
          );
        }
      },
    },
  },
});

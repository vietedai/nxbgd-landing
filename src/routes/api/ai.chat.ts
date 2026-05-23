import { createFileRoute } from "@tanstack/react-router";

// POST /api/ai/chat — proxy streaming chat tới Lovable AI Gateway
export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages, system, model } = (await request.json()) as {
            messages: {
              role: "user" | "assistant" | "system";
              content: string;
            }[];
            system?: string;
            model?: string;
          };

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return Response.json(
              { error: "LOVABLE_API_KEY chưa được cấu hình" },
              { status: 500 },
            );
          }

          const finalMessages = system
            ? [{ role: "system" as const, content: system }, ...messages]
            : messages;

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
                messages: finalMessages,
                stream: true,
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
                {
                  error:
                    "Đã hết credits AI, vui lòng nạp thêm tại Settings → Workspace → Usage.",
                },
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

          return new Response(upstream.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (e) {
          console.error("ai.chat error", e);
          return Response.json(
            { error: e instanceof Error ? e.message : "Lỗi không xác định" },
            { status: 500 },
          );
        }
      },
    },
  },
});

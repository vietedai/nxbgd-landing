// Helpers gọi AI từ phía client thông qua server routes /api/ai/*

export type ChatMsg = { role: "user" | "assistant"; content: string };

export async function streamChat({
  messages,
  system,
  model,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: ChatMsg[];
  system?: string;
  model?: string;
  onDelta: (text: string) => void;
  onDone?: () => void;
  onError?: (msg: string) => void;
  signal?: AbortSignal;
}) {
  try {
    const resp = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system, model }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      const data = await resp.json().catch(() => ({ error: "Lỗi khi gọi AI" }));
      onError?.(data.error ?? `HTTP ${resp.status}`);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: rd, value } = await reader.read();
      if (rd) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(json);
          const content: string | undefined =
            parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone?.();
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    onError?.(e instanceof Error ? e.message : "Lỗi không xác định");
  }
}

export async function callAIJson<T>({
  system,
  prompt,
  tool,
  model,
}: {
  system?: string;
  prompt: string;
  tool: { name: string; description: string; parameters: unknown };
  model?: string;
}): Promise<{ data?: T; error?: string }> {
  try {
    const resp = await fetch("/api/ai/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, prompt, tool, model }),
    });
    const json = await resp.json();
    if (!resp.ok) return { error: json.error ?? `HTTP ${resp.status}` };
    return { data: json.data as T };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Lỗi không xác định" };
  }
}

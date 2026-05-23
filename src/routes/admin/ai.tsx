import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/admin/ai")({
  head: () => ({ meta: [{ title: "AI Config | Admin - NXBGDVN" }] }),
  component: AiPage,
});

const FEATURES = [
  {
    id: "suggest",
    name: "Gợi ý bài học cá nhân hoá",
    desc: "AI phân tích lịch sử học và gợi ý bài kế tiếp",
    on: true,
  },
  {
    id: "essay",
    name: "AI chấm tự luận",
    desc: "GPT-4 chấm và đưa rubric tiếng Việt",
    on: true,
  },
  {
    id: "adaptive",
    name: "Adaptive difficulty",
    desc: "Tự động điều chỉnh độ khó câu hỏi",
    on: true,
  },
  {
    id: "gen",
    name: "Sinh câu hỏi tự động",
    desc: "AI sinh câu hỏi từ chương sách",
    on: true,
    beta: true,
  },
  {
    id: "remind",
    name: "Nhắc học qua app",
    desc: "Push notification thông minh dựa trên thói quen",
    on: true,
  },
  {
    id: "tutor",
    name: "Trợ lí AI 1-1 (Ong Chăm Chỉ)",
    desc: "Chat box hỗ trợ học sinh",
    on: true,
  },
  {
    id: "voice",
    name: "Voice feedback (TTS)",
    desc: "Đọc đáp án bằng giọng tiếng Việt",
    on: false,
    beta: true,
  },
];

function AiPage() {
  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">🧠 AI Config</h1>
          <p className="text-muted-foreground">
            Quản lí 7 tính năng AI trên toàn hệ thống
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="p-4 border-2 border-fun bg-fun/5">
            <div className="text-xs text-muted-foreground">AI calls / ngày</div>
            <div className="font-display text-2xl font-bold">458K</div>
          </Card>
          <Card className="p-4 border-2 border-primary bg-primary/5">
            <div className="text-xs text-muted-foreground">Latency TB</div>
            <div className="font-display text-2xl font-bold">820ms</div>
          </Card>
          <Card className="p-4 border-2 border-success bg-success/5">
            <div className="text-xs text-muted-foreground">Success rate</div>
            <div className="font-display text-2xl font-bold">99.4%</div>
          </Card>
        </div>

        <Card className="p-5 border-2">
          <div className="font-display font-bold mb-3 flex items-center gap-2">
            <Brain className="text-fun" /> Tính năng AI
          </div>
          <div className="space-y-2">
            {FEATURES.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-xl border-2 bg-card flex items-center gap-3"
              >
                <div className="flex-1">
                  <div className="font-bold flex items-center gap-2">
                    {f.name}
                    {f.beta && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/20 text-warning-foreground">
                        BETA
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </div>
                <Switch defaultChecked={f.on} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-2 border-info bg-info/5">
          <div className="font-display font-bold text-info mb-2">
            ⚙️ Model Provider
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Default LLM</span>
              <b>Lovable AI Gateway · Gemini 2.5 Flash</b>
            </div>
            <div className="flex justify-between">
              <span>Vision model</span>
              <b>Gemini 2.5 Pro</b>
            </div>
            <div className="flex justify-between">
              <span>TTS</span>
              <b>Vietnamese Neural · zalo-tts</b>
            </div>
            <div className="flex justify-between">
              <span>Embedding</span>
              <b>text-embedding-3-small</b>
            </div>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

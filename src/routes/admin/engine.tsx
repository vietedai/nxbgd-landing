import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gamepad2 } from "lucide-react";
import { TYPE_LABELS } from "@/components/interactions/QuestionRenderer";

export const Route = createFileRoute("/admin/engine")({
  head: () => ({ meta: [{ title: "Game engine | Admin - NXBGDVN" }] }),
  component: EnginePage,
});

function EnginePage() {
  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">
              🎮 Interaction Engine
            </h1>
            <p className="text-muted-foreground">
              23 kiểu tương tác · v2.4.1 · Đang chạy ổn định
            </p>
          </div>
          <Button className="btn-pop rounded-full">
            <Plus className="size-4 mr-1" />
            Thêm kiểu mới
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { l: "Tổng kiểu", v: "23", c: "primary" },
            { l: "Active", v: "23", c: "success" },
            { l: "Beta", v: "2", c: "warning" },
          ].map((s) => (
            <Card
              key={s.l}
              className={`p-4 border-2 border-${s.c}/30 bg-${s.c}/5`}
            >
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="font-display text-2xl font-bold">{s.v}</div>
            </Card>
          ))}
        </div>

        <Card className="p-5 border-2">
          <div className="font-display font-bold mb-3 flex items-center gap-2">
            <Gamepad2 className="text-fun" /> Quản lý 23 kiểu tương tác
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-center p-2.5 rounded-lg border bg-card hover:border-primary transition-all"
              >
                <div>
                  <div className="font-bold">{v}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {k}
                  </div>
                </div>
                <span className="text-xs text-success font-bold">● Active</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Database, Activity, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/system")({
  head: () => ({ meta: [{ title: "Hệ thống | Admin - NXBGDVN" }] }),
  component: SystemPage,
});

function SystemPage() {
  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">🖥️ Hệ thống</h1>
          <p className="text-muted-foreground">
            Trạng thái hạ tầng, backup và bảo mật
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { l: "Uptime 30d", v: "99.97%", c: "success", I: Activity },
            { l: "Servers", v: "24", c: "primary", I: Server },
            { l: "DB size", v: "1.4 TB", c: "info", I: Database },
            { l: "Security score", v: "A+", c: "fun", I: ShieldCheck },
          ].map((s) => (
            <Card
              key={s.l}
              className={`p-4 border-2 border-${s.c}/30 bg-${s.c}/5`}
            >
              <s.I className={`text-${s.c} size-5 mb-1`} />
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="font-display text-2xl font-bold">{s.v}</div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2">
            <div className="font-display font-bold mb-3">
              🔋 Trạng thái dịch vụ
            </div>
            <div className="space-y-2 text-sm">
              {[
                { s: "API Gateway", st: "ok" },
                { s: "Database (Postgres)", st: "ok" },
                { s: "AI Gateway", st: "ok" },
                { s: "CDN / Storage", st: "ok" },
                { s: "Notification Service", st: "warn" },
                { s: "Analytics", st: "ok" },
              ].map((r) => (
                <div
                  key={r.s}
                  className="flex justify-between p-2 rounded-lg bg-card border"
                >
                  <span>{r.s}</span>
                  <span
                    className={`font-bold ${r.st === "ok" ? "text-success" : "text-warning-foreground"}`}
                  >
                    ● {r.st === "ok" ? "Healthy" : "Degraded"}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-2">
            <div className="font-display font-bold mb-3">
              💾 Backup & Bảo trì
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 rounded-lg bg-card border">
                <span>Backup gần nhất</span>
                <b>Hôm nay 03:00</b>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-card border">
                <span>Backup version</span>
                <b>v2.4.1-bk</b>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-card border">
                <span>Bảo trì tiếp theo</span>
                <b>25/04/2026 02:00</b>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="rounded-full">
                Backup ngay
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                Lập lịch bảo trì
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

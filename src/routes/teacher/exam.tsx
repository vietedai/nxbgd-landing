import { createFileRoute } from "@tanstack/react-router";
import { TeacherShell } from "@/components/TeacherShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Plus,
  FileText,
  ClipboardList,
  Trash2,
  BookOpen,
} from "lucide-react";
import {
  PAPERS,
  KIND_LABEL,
  SOURCE_LABEL,
  SOURCE_BADGE_CLASS,
  type PaperKind,
} from "@/lib/mock-papers";
import { useState } from "react";
import { ManualPaperWizard } from "@/components/teacher/ManualPaperWizard";
import { AIPaperWizard } from "@/components/teacher/AIPaperWizard";
import { TextbookPaperWizard } from "@/components/teacher/TextbookPaperWizard";

export const Route = createFileRoute("/teacher/exam")({
  head: () => ({
    meta: [{ title: "Tạo đề kiểm tra/phiếu bài tập | Giáo viên - NXBGDVN" }],
  }),
  component: ExamPage,
});

function ExamPage() {
  const [kind, setKind] = useState<PaperKind>("worksheet");
  const [manualOpen, setManualOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const filtered = PAPERS.filter((p) => p.kind === kind);
  const kindLabel = KIND_LABEL[kind];
  const kindLower = kindLabel.toLowerCase();
  const isWorksheet = kind === "worksheet";

  return (
    <TeacherShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">
            📝 Tạo đề kiểm tra/phiếu bài tập
          </h1>
          <p className="text-muted-foreground">
            Tạo <strong>phiếu bài tập</strong> và <strong>đề kiểm tra</strong>{" "}
            từ ngân hàng 72k câu hỏi — bằng AI hoặc thủ công theo ma trận đề.
          </p>
        </div>

        <Tabs value={kind} onValueChange={(v) => setKind(v as PaperKind)}>
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="worksheet" className="gap-1">
              <ClipboardList className="size-4" /> Phiếu bài tập
            </TabsTrigger>
            <TabsTrigger value="exam" className="gap-1">
              <FileText className="size-4" /> Đề kiểm tra
            </TabsTrigger>
          </TabsList>

          <TabsContent value={kind} className="space-y-5 mt-5">
            <div
              className={
                isWorksheet
                  ? "grid md:grid-cols-3 gap-3"
                  : "grid md:grid-cols-2 gap-3"
              }
            >
              {isWorksheet && (
                <button
                  type="button"
                  onClick={() => setBookOpen(true)}
                  className="text-left rounded-2xl border-2 border-info bg-gradient-to-br from-info/15 via-info/5 to-transparent p-5 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-info/20 p-2.5 group-hover:scale-110 transition-transform">
                      <BookOpen className="size-6 text-info" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-lg text-info">
                        📚 Theo sách bài tập
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Chọn phiếu có sẵn trong SBT & giao trực tiếp cho lớp.
                      </p>
                    </div>
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setManualOpen(true)}
                className="text-left rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-transparent p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/15 p-2.5 group-hover:scale-110 transition-transform">
                    <Plus className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-primary">
                      ➕ Tạo {kindLower} thủ công
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Tự thiết kế: chọn môn, ma trận, câu hỏi từ ngân hàng &
                      giao theo lớp.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiOpen(true)}
                className="text-left rounded-2xl border-2 border-fun bg-gradient-to-br from-fun/15 via-primary/5 to-transparent p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-fun/20 p-2.5 group-hover:scale-110 transition-transform">
                    <Sparkles className="size-6 text-fun" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-fun">
                      ✨ AI sinh {kindLower}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      AI tự phân tích năng lực HS, sinh & giao {kindLower} cá
                      nhân hoá trong 30 giây.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-xl font-bold">
                  📂 {kindLabel} đã tạo ({filtered.length})
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {filtered.map((p) => (
                  <Card
                    key={p.id}
                    className="p-4 border-2 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="font-bold">{p.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {p.subject} · {p.grade} · {p.questionCount} câu ·{" "}
                          {p.durationMin} phút
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_BADGE_CLASS[p.source]}`}
                      >
                        {SOURCE_LABEL[p.source]}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-1.5 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-success/15 text-success">
                        🟢 {p.easy} dễ
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning-foreground">
                        🟡 {p.medium} TB
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                        🔴 {p.hard} khó
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Tạo: {p.createdAt}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Xem / sửa
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ManualPaperWizard
        open={manualOpen}
        onOpenChange={setManualOpen}
        kind={kind}
      />
      <AIPaperWizard open={aiOpen} onOpenChange={setAiOpen} kind={kind} />
      <TextbookPaperWizard
        open={bookOpen}
        onOpenChange={setBookOpen}
        kind={kind}
      />
    </TeacherShell>
  );
}

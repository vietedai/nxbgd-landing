import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Send,
  Sparkles,
  Mail,
  MessageSquare,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface ParentReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  subjectName?: string;
}

const STUDENTS = [
  {
    id: "s1",
    name: "Nguyễn Bảo An",
    parent: "Nguyễn Văn A",
    phone: "0912***234",
    score: 9.2,
    mastery: 92,
    status: "good" as const,
  },
  {
    id: "s2",
    name: "Trần Văn Bình",
    parent: "Trần Thị B",
    phone: "0987***112",
    score: 5.4,
    mastery: 54,
    status: "weak" as const,
  },
  {
    id: "s3",
    name: "Lê Thị Hoa",
    parent: "Lê Văn C",
    phone: "0903***556",
    score: 4.8,
    mastery: 48,
    status: "weak" as const,
  },
  {
    id: "s4",
    name: "Phạm Minh Khôi",
    parent: "Phạm Thị D",
    phone: "0978***889",
    score: 7.6,
    mastery: 76,
    status: "ok" as const,
  },
  {
    id: "s5",
    name: "Hoàng Thị Mai",
    parent: "Hoàng Văn E",
    phone: "0934***123",
    score: 9.8,
    mastery: 98,
    status: "good" as const,
  },
  {
    id: "s6",
    name: "Đỗ Quang Huy",
    parent: "Đỗ Thị F",
    phone: "0945***678",
    score: 6.5,
    mastery: 65,
    status: "ok" as const,
  },
  {
    id: "s7",
    name: "Vũ Thanh Hằng",
    parent: "Vũ Văn G",
    phone: "0967***901",
    score: 5.0,
    mastery: 50,
    status: "weak" as const,
  },
  {
    id: "s8",
    name: "Phan Đức Minh",
    parent: "Phan Thị H",
    phone: "0921***345",
    score: 8.8,
    mastery: 88,
    status: "good" as const,
  },
];

const STATUS_META = {
  good: {
    label: "Học tốt",
    cls: "bg-success/15 text-success border-success/30",
  },
  ok: {
    label: "Trung bình",
    cls: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  weak: {
    label: "Cần hỗ trợ",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

export function ParentReportDialog({
  open,
  onOpenChange,
  className = "4A",
  subjectName = "Khoa học",
}: ParentReportDialogProps) {
  const [step, setStep] = useState<"select" | "compose" | "preview">("select");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    STUDENTS.map((s) => s.id),
  );
  const [channel, setChannel] = useState<"email" | "sms" | "zalo" | "pdf">(
    "email",
  );
  const [period, setPeriod] = useState("hk1");
  const [tone, setTone] = useState("encouraging");
  const [includeStrengths, setIncludeStrengths] = useState(true);
  const [includeWeaknesses, setIncludeWeaknesses] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeScores, setIncludeScores] = useState(true);
  const [customNote, setCustomNote] = useState("");
  const [previewStudent, setPreviewStudent] = useState(STUDENTS[0]);

  const toggleAll = (checked: boolean) =>
    setSelectedIds(checked ? STUDENTS.map((s) => s.id) : []);
  const toggleOne = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const selectedStudents = STUDENTS.filter((s) => selectedIds.includes(s.id));

  const reset = () => {
    setStep("select");
    setCustomNote("");
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const handleSend = () => {
    const channelLabel = {
      email: "Email",
      sms: "SMS",
      zalo: "Zalo OA",
      pdf: "PDF",
    }[channel];
    toast.success(
      `Đã gửi ${selectedStudents.length} báo cáo qua ${channelLabel}`,
      {
        description: "Phụ huynh sẽ nhận thông báo trong vài phút.",
      },
    );
    handleClose(false);
  };

  const buildReportText = (s: (typeof STUDENTS)[number]) => {
    const meta = STATUS_META[s.status];
    const lines: string[] = [];
    lines.push(`Kính gửi phụ huynh em ${s.name},`);
    lines.push("");
    lines.push(
      `Cô xin gửi báo cáo học tập môn ${subjectName} — Lớp ${className} (${period === "hk1" ? "Học kỳ I" : period === "hk2" ? "Học kỳ II" : "Tháng này"}):`,
    );
    if (includeScores) {
      lines.push("");
      lines.push(`• Điểm trung bình: ${s.score.toFixed(1)}/10`);
      lines.push(`• Mức độ thành thạo: ${s.mastery}%`);
      lines.push(`• Xếp loại: ${meta.label}`);
    }
    if (includeStrengths) {
      lines.push("");
      lines.push("✨ Điểm mạnh:");
      lines.push(
        s.status === "good"
          ? "- Em nắm vững kiến thức, làm bài tập đầy đủ và đúng hạn."
          : s.status === "ok"
            ? "- Em có nỗ lực trong học tập, tham gia thảo luận nhóm tích cực."
            : "- Em có tinh thần cầu tiến và sẵn sàng đặt câu hỏi khi chưa hiểu bài.",
      );
    }
    if (includeWeaknesses) {
      lines.push("");
      lines.push("📌 Cần cải thiện:");
      lines.push(
        s.status === "good"
          ? "- Có thể thử thách bản thân với các bài tập nâng cao."
          : s.status === "ok"
            ? "- Cần luyện tập thêm các dạng bài về Dinh dưỡng và Vòng tuần hoàn của nước."
            : "- Còn yếu ở chủ đề Dinh dưỡng; cần dành thêm thời gian ôn tập cơ bản.",
      );
    }
    if (includeRecommendations) {
      lines.push("");
      lines.push("💡 Khuyến nghị:");
      lines.push(
        s.status === "weak"
          ? "- Phụ huynh cùng em ôn tập 15-20 phút/ngày, làm lại các phiếu bài tập trên SBT online."
          : "- Duy trì nhịp học đều, khuyến khích em tự làm bài và trao đổi với cô khi cần.",
      );
    }
    if (customNote.trim()) {
      lines.push("");
      lines.push("Lời nhắn của giáo viên:");
      lines.push(customNote.trim());
    }
    lines.push("");
    lines.push("Trân trọng,");
    lines.push("Cô Lan — GV chủ nhiệm lớp " + className);
    return lines.join("\n");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-5 border-b-2 bg-gradient-to-r from-fun/10 to-primary/10">
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            📬 Báo cáo phụ huynh — Lớp {className}
          </DialogTitle>
          <DialogDescription>
            Môn {subjectName} · Gửi báo cáo học tập tới phụ huynh qua nhiều kênh
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-5 py-3 border-b flex items-center gap-2 text-xs">
          {[
            { k: "select", l: "1. Chọn HS" },
            { k: "compose", l: "2. Nội dung" },
            { k: "preview", l: "3. Xem trước & Gửi" },
          ].map((s, i) => (
            <div key={s.k} className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full font-bold ${step === s.k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {s.l}
              </div>
              {i < 2 && <div className="w-4 h-px bg-border" />}
            </div>
          ))}
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-5">
            {step === "select" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold">
                    Chọn học sinh ({selectedIds.length}/{STUDENTS.length})
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id="all"
                      checked={selectedIds.length === STUDENTS.length}
                      onCheckedChange={(c) => toggleAll(!!c)}
                    />
                    <Label htmlFor="all" className="cursor-pointer">
                      Chọn tất cả
                    </Label>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      setSelectedIds(
                        STUDENTS.filter((s) => s.status === "weak").map(
                          (s) => s.id,
                        ),
                      )
                    }
                  >
                    Chỉ HS cần hỗ trợ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      setSelectedIds(
                        STUDENTS.filter((s) => s.status === "good").map(
                          (s) => s.id,
                        ),
                      )
                    }
                  >
                    Chỉ HS học tốt
                  </Button>
                </div>
                <div className="rounded-xl border-2 divide-y">
                  {STUDENTS.map((s) => {
                    const meta = STATUS_META[s.status];
                    const checked = selectedIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/40"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleOne(s.id)}
                        />
                        <div className="size-9 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">
                            {s.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            PH: {s.parent} · {s.phone}
                          </div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-muted-foreground">
                            Điểm TB
                          </div>
                          <div className="font-bold">{s.score.toFixed(1)}</div>
                        </div>
                        <Badge variant="outline" className={meta.cls}>
                          {meta.label}
                        </Badge>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "compose" && (
              <div className="space-y-5">
                <div>
                  <Label className="mb-2 block font-bold">Kênh gửi</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { k: "email", l: "Email", i: Mail },
                      { k: "sms", l: "SMS", i: MessageSquare },
                      { k: "zalo", l: "Zalo OA", i: Send },
                      { k: "pdf", l: "PDF tải về", i: FileText },
                    ].map((c) => {
                      const Icon = c.i;
                      const active = channel === c.k;
                      return (
                        <button
                          key={c.k}
                          type="button"
                          onClick={() => setChannel(c.k as typeof channel)}
                          className={`rounded-xl border-2 p-3 text-sm flex flex-col items-center gap-1 transition ${active ? "border-primary bg-primary/10 font-bold" : "border-border hover:border-primary/50"}`}
                        >
                          <Icon className="size-5" />
                          {c.l}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-2 block font-bold">Kỳ báo cáo</Label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="hk1">Học kỳ I</SelectItem>
                        <SelectItem value="hk2">Học kỳ II</SelectItem>
                        <SelectItem value="year">Cả năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block font-bold">Giọng văn</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="encouraging">
                          Động viên, tích cực
                        </SelectItem>
                        <SelectItem value="formal">Trang trọng</SelectItem>
                        <SelectItem value="direct">
                          Thẳng thắn, chi tiết
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block font-bold">
                    Nội dung kèm theo
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      {
                        k: "scores",
                        l: "Điểm số & mức độ thành thạo",
                        v: includeScores,
                        s: setIncludeScores,
                      },
                      {
                        k: "str",
                        l: "Điểm mạnh của học sinh",
                        v: includeStrengths,
                        s: setIncludeStrengths,
                      },
                      {
                        k: "weak",
                        l: "Điểm cần cải thiện",
                        v: includeWeaknesses,
                        s: setIncludeWeaknesses,
                      },
                      {
                        k: "rec",
                        l: "Khuyến nghị cho phụ huynh",
                        v: includeRecommendations,
                        s: setIncludeRecommendations,
                      },
                    ].map((o) => (
                      <label
                        key={o.k}
                        className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/40"
                      >
                        <Checkbox
                          checked={o.v}
                          onCheckedChange={(c) => o.s(!!c)}
                        />
                        <span className="text-sm">{o.l}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="note"
                    className="mb-2 block font-bold flex items-center gap-2"
                  >
                    Lời nhắn riêng (tuỳ chọn)
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 text-fun"
                      onClick={() =>
                        setCustomNote(
                          "Cảm ơn quý phụ huynh đã đồng hành cùng nhà trường. Mong gia đình tiếp tục hỗ trợ các em ôn bài tại nhà.",
                        )
                      }
                    >
                      <Sparkles className="size-3" /> AI gợi ý
                    </Button>
                  </Label>
                  <Textarea
                    id="note"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Ví dụ: Tuần tới lớp sẽ có bài kiểm tra chủ đề Dinh dưỡng..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Label className="font-bold">Xem trước báo cáo của:</Label>
                  <Select
                    value={previewStudent.id}
                    onValueChange={(id) =>
                      setPreviewStudent(
                        STUDENTS.find((s) => s.id === id) ?? STUDENTS[0],
                      )
                    }
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedStudents.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Card className="p-5 border-2 bg-background">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                    <Eye className="size-3" /> Bản xem trước · Kênh:{" "}
                    <b className="capitalize">{channel}</b>
                  </div>
                  <Separator className="mb-3" />
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {buildReportText(previewStudent)}
                  </pre>
                </Card>
                <Card className="p-4 bg-info/5 border-info/30">
                  <div className="text-sm">
                    <b>Tổng kết:</b> Sẽ gửi <b>{selectedStudents.length}</b> báo
                    cáo qua{" "}
                    <b className="capitalize">
                      {channel === "pdf" ? "tải PDF" : channel}
                    </b>
                    .
                    {channel === "email" &&
                      " Phụ huynh sẽ nhận email trong 1-2 phút."}
                    {channel === "sms" &&
                      ` Ước tính chi phí: ${selectedStudents.length * 800}đ.`}
                    {channel === "zalo" &&
                      " Tin nhắn qua Zalo OA (miễn phí với thuê bao mẫu giáo)."}
                    {channel === "pdf" &&
                      " File ZIP chứa tất cả báo cáo sẽ được tải về."}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t-2 bg-muted/30 flex-row justify-between sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground self-center">
            Đã chọn <b>{selectedIds.length}</b> học sinh
          </div>
          <div className="flex gap-2">
            {step !== "select" && (
              <Button
                variant="outline"
                onClick={() =>
                  setStep(step === "preview" ? "compose" : "select")
                }
              >
                Quay lại
              </Button>
            )}
            {step !== "preview" ? (
              <Button
                className="btn-pop"
                disabled={selectedIds.length === 0}
                onClick={() =>
                  setStep(step === "select" ? "compose" : "preview")
                }
              >
                Tiếp tục
              </Button>
            ) : (
              <Button className="btn-pop" onClick={handleSend}>
                {channel === "pdf" ? (
                  <>
                    <Download className="size-4 mr-1" /> Tải{" "}
                    {selectedStudents.length} báo cáo
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-1" /> Gửi{" "}
                    {selectedStudents.length} báo cáo
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

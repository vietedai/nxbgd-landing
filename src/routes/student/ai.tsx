import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, PenLine } from "lucide-react";
import mascot from "@/assets/mascot-bee.png";
import { FlashcardsPanel } from "@/components/student/ai/FlashcardsPanel";
import { EssayCoachPanel } from "@/components/student/ai/EssayCoachPanel";

export const Route = createFileRoute("/student/ai")({
  head: () => ({
    meta: [{ title: "Ong Chăm Chỉ - Trợ lí AI | Học sinh - NXBGDVN" }],
  }),
  component: StudentAIHub,
});

function StudentAIHub() {
  return (
    <StudentShell>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={mascot}
            alt="Ong Chăm Chỉ"
            className="size-16 animate-float"
          />
          <div>
            <div className="flex items-center gap-2 text-fun mb-1">
              <Sparkles className="size-4" />
              <span className="text-xs uppercase font-bold">Trợ lí AI</span>
            </div>
            <h1 className="font-display text-3xl font-bold">🐝 Ong Chăm Chỉ</h1>
            <p className="text-muted-foreground">
              Bạn AI của em — học từ vựng bằng flashcard và nhờ Cô AI chấm văn
              nhé!
            </p>
          </div>
        </div>

        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="flashcards" className="py-2.5 gap-2">
              <Sparkles className="size-4" />{" "}
              <span className="hidden sm:inline">Flashcard AI</span>
            </TabsTrigger>
            <TabsTrigger value="essay" className="py-2.5 gap-2">
              <PenLine className="size-4" />{" "}
              <span className="hidden sm:inline">Cô AI chấm văn</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flashcards" className="mt-4">
            <FlashcardsPanel />
          </TabsContent>
          <TabsContent value="essay" className="mt-4">
            <EssayCoachPanel />
          </TabsContent>
        </Tabs>
      </div>
    </StudentShell>
  );
}

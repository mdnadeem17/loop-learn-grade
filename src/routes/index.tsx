import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadView } from "@/components/looplearn/UploadView";
import { Flashcard, type FlashcardData } from "@/components/looplearn/Flashcard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LoopLearn — Turn Mistakes into Flashcards" },
      { name: "description", content: "Upload your answer sheet and get AI-generated active-recall flashcards." },
      { property: "og:title", content: "LoopLearn — Turn Mistakes into Flashcards" },
      { property: "og:description", content: "Upload your answer sheet and get AI-generated active-recall flashcards." },
    ],
  }),
  component: Index,
});

const CARDS: FlashcardData[] = [
  {
    id: "grammar", topic: "Grammar · Articles",
    badge: "🚨 Relook Required: Repeated Error (Test 1 & 2)",
    wrote: "a apple", correction: "an apple",
    deepDive: "The rule depends on the sound, not just the letter. 'Apple' starts with a vowel sound (/æ/), so it requires 'an' for a smoother transition.",
  },
  {
    id: "history", topic: "History · Modern India",
    wrote: "Battle of Plassey happened in 1946",
    correction: "Battle of Plassey happened on June 23, 1757",
    deepDive: "The Battle of Plassey in 1757 was a pivotal victory for the British East India Company. 1946 was just prior to Indian independence.",
  },
];

function Index() {
  const [step, setStep] = useState<"upload" | "review">("upload");
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-6">
          <div className="h-6 w-6 rounded-sm bg-foreground" />
          <span className="text-lg font-extrabold tracking-tight">LoopLearn</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <AnimatePresence mode="wait">
          {step === "upload" ? (
            <motion.div key="up" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <UploadView onAnalyze={() => setStep("review")} />
            </motion.div>
          ) : (
            <motion.div key="rev" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Your Feedback Analysis</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Here are your conceptual gaps converted into active-recall flashcards.
              </p>
              <div className="mt-10 flex flex-col gap-5">
                {CARDS.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
                    <Flashcard card={c} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Button variant="ghost" onClick={() => setStep("upload")}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadView } from "@/components/looplearn/UploadView";
import type { FlashcardData } from "@/components/looplearn/Flashcard";
import { FlipCard } from "@/components/looplearn/FlipCard";

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
  {
    id: "science", topic: "Science · Photosynthesis",
    wrote: "Plants release carbon dioxide during photosynthesis",
    correction: "Plants release oxygen during photosynthesis",
    deepDive: "Photosynthesis takes in carbon dioxide and water and, using sunlight, produces glucose and oxygen. CO₂ is released during respiration, not photosynthesis.",
  },
  {
    id: "math", topic: "Math · Fractions",
    badge: "🚨 Relook Required",
    wrote: "1/2 + 1/3 = 2/5",
    correction: "1/2 + 1/3 = 5/6",
    deepDive: "You can't add numerators and denominators directly. Convert to a common denominator first: 3/6 + 2/6 = 5/6.",
  },
];

function Index() {
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const go = (d: number) => {
    setIsFlipped(false);
    setCurrentCardIndex((i) => Math.min(CARDS.length - 1, Math.max(0, i + d)));
  };
  const card = CARDS[currentCardIndex]!;
  const reset = () => { setStep("upload"); setCurrentCardIndex(0); setIsFlipped(false); };
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
              <div className="mt-10">
                <AnimatePresence mode="wait">
                  <motion.div key={card.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                    <FlipCard card={card} isFlipped={isFlipped} onFlip={() => setIsFlipped((f) => !f)} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6">
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-sm" aria-label="Previous card" disabled={currentCardIndex === 0} onClick={() => go(-1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="min-w-28 text-center text-sm font-semibold tabular-nums">Card {currentCardIndex + 1} of {CARDS.length}</span>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-sm" aria-label="Next card" disabled={currentCardIndex === CARDS.length - 1} onClick={() => go(1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="ghost" onClick={reset}>
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

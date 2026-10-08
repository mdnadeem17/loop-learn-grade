import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Target, Flame, Lightbulb, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UploadView } from "@/components/looplearn/UploadView";
import type { FlashcardData } from "@/components/looplearn/Flashcard";
import { FlipCard } from "@/components/looplearn/FlipCard";
import { analyzeAnswers } from "@/lib/ai-action";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cognify — Turn Mistakes into Mastery" },
      { name: "description", content: "Upload your answer sheet and get AI-generated active-recall flashcards." },
      { property: "og:title", content: "Cognify — Turn Mistakes into Mastery" },
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
  const [analysis, setAnalysis] = useState<any>(null);

  const go = (d: number) => {
    setIsFlipped(false);
    if (analysis?.cards) {
      setCurrentCardIndex((i) => Math.min(analysis.cards.length - 1, Math.max(0, i + d)));
    }
  };
  const card = analysis?.cards?.[currentCardIndex];
  const reset = () => { setStep("upload"); setCurrentCardIndex(0); setIsFlipped(false); setAnalysis(null); };

  const handleAnalyze = async (base64?: string, mimeType?: string) => {
    try {
      const result = await analyzeAnswers({ data: { imageBase64: base64, mimeType } });
      setAnalysis(result);
      setStep("review");
    } catch (e) {
      console.error(e);
      alert("Failed to analyze. Please try again.");
      throw e;
    }
  };
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm shadow-indigo-500/20">
            <div className="absolute inset-0 rounded-xl bg-white/10 mix-blend-overlay"></div>
            <BrainCircuit className="h-5 w-5 text-white relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-indigo-950 to-violet-900 bg-clip-text text-xl font-black tracking-tighter text-transparent dark:from-white dark:to-white/80">Cognify</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <AnimatePresence mode="wait">
          {step === "upload" ? (
            <motion.div key="up" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <UploadView onAnalyze={handleAnalyze} />
            </motion.div>
          ) : (
            <motion.div key="rev" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Your Feedback Analysis</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Here are your conceptual gaps converted into active-recall flashcards.
              </p>
              
              {card && (
                <div className="mt-10">
                  <AnimatePresence mode="wait">
                    <motion.div key={card.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                      <FlipCard card={card} isFlipped={isFlipped} onFlip={() => setIsFlipped((f) => !f)} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-center gap-6">
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-sm" aria-label="Previous card" disabled={currentCardIndex === 0} onClick={() => go(-1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="min-w-28 text-center text-sm font-semibold tabular-nums">Card {currentCardIndex + 1} of {analysis?.cards?.length || 0}</span>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-sm" aria-label="Next card" disabled={currentCardIndex === (analysis?.cards?.length || 1) - 1} onClick={() => go(1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex justify-center">
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
              </div>

              {/* Study Guide Section */}
              {analysis && (
                <div className="mt-24 border-t border-border/50 pt-16">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mb-12 text-center"
                  >
                    <h2 className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                      Your Study Guide
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-500" /> Let's focus on these areas to level up!
                    </p>
                  </motion.div>
                  
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {analysis.focusAreas?.map((area: any, idx: number) => {
                      const isNeedsReview = area.status === "Needs Review";
                      const isAlmostThere = area.status === "Almost There";
                      
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.15, duration: 0.4 }}
                        >
                          <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-card/50">
                            <div className="flex items-start gap-4">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                isNeedsReview ? "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" :
                                isAlmostThere ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" :
                                "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                              }`}>
                                {isNeedsReview ? <Target className="h-6 w-6" /> : isAlmostThere ? <Flame className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                              </div>
                              <div>
                                <div className={`mb-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  isNeedsReview ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" :
                                  isAlmostThere ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" :
                                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                }`}>
                                  {area.status}
                                </div>
                                <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight">{area.title}</h3>
                              </div>
                            </div>
                            <div className="mt-4 flex-1">
                              <p className="text-sm text-muted-foreground">{area.description}</p>
                            </div>
                            <div className="mt-5 rounded-2xl bg-indigo-50/50 p-4 text-sm font-medium text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-200">
                              <span className="block text-xs font-bold uppercase tracking-wider text-indigo-500/80 mb-1">Next Step</span>
                              {area.nextStep}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <div className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[1px] shadow-lg">
                      <div className="absolute inset-0 bg-white/10 opacity-50 mix-blend-overlay blur-xl"></div>
                      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-[22px] bg-background/95 p-6 backdrop-blur-xl sm:p-8">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
                          <BrainCircuit className="h-8 w-8" />
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Cognify Says...</h3>
                          <div className="text-base leading-relaxed text-muted-foreground">
                            <div dangerouslySetInnerHTML={{ __html: analysis.recommendation.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-400 dark:text-indigo-300">$1</strong>') }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

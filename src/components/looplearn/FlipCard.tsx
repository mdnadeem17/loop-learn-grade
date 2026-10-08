import { motion } from "framer-motion";
import { RefreshCw, XCircle, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import type { FlashcardData } from "./Flashcard";

export function FlipCard({ card, isFlipped, onFlip }: { card: FlashcardData; isFlipped: boolean; onFlip: () => void }) {
  const commonFace = "absolute inset-0 flex flex-col rounded-[2rem] border-2 p-10 shadow-2xl shadow-black/5";
  const frontFace = `${commonFace} bg-gradient-to-br from-rose-50/80 via-white to-red-50/80 border-rose-200/50 dark:from-rose-950/40 dark:via-background dark:to-red-950/40 dark:border-rose-900/50`;
  const backFace = `${commonFace} bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 border-emerald-200/50 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/40 dark:border-emerald-900/50`;

  return (
    <div className="mx-auto w-full max-w-2xl" style={{ perspective: '2000px' }}>
      <motion.button
        type="button"
        onClick={onFlip}
        aria-label={isFlipped ? "Show mistake" : "Show correction"}
        className="relative block h-[480px] w-full cursor-pointer text-left group"
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02, translateY: -8 }}
        whileTap={{ scale: 0.97 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25, mass: 1 }}
      >
        {/* Front */}
        <div 
          className={frontFace} 
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden', 
            transform: 'rotateY(0deg)' 
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08] dark:opacity-10 dark:group-hover:opacity-20 pointer-events-none">
            <XCircle className="h-64 w-64 text-rose-600" />
          </div>
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-rose-600 shadow-sm backdrop-blur-md dark:bg-black/20 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" /> Fumbled: {card.topic}
            </span>
            {card.badge && (
              <span className="rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 shadow-sm dark:border-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                {card.badge}
              </span>
            )}
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
            <p className="mb-6 text-sm font-bold uppercase tracking-widest text-rose-400/80">You Wrote</p>
            <div className="relative w-full px-8">
              <span className="absolute -left-2 -top-8 text-7xl font-serif text-rose-200/60 dark:text-rose-800/60">"</span>
              <p className="text-3xl font-black tracking-tight text-rose-950 dark:text-rose-100 sm:text-4xl leading-tight">
                {card.wrote}
              </p>
              <span className="absolute -bottom-14 -right-2 text-7xl font-serif text-rose-200/60 dark:text-rose-800/60">"</span>
            </div>
          </div>
          <p className="relative z-10 flex items-center justify-center gap-2 text-sm font-bold text-rose-400 transition-colors group-hover:text-rose-600 dark:text-rose-600 dark:group-hover:text-rose-400">
            <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" /> Tap to reveal correction
          </p>
        </div>

        {/* Back */}
        <div 
          className={backFace} 
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)' 
          }}
        >
          <div className="absolute top-0 left-0 p-8 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08] dark:opacity-10 dark:group-hover:opacity-20 pointer-events-none">
            <CheckCircle2 className="h-64 w-64 text-emerald-600" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-600 shadow-sm backdrop-blur-md dark:bg-black/20 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Model Answer
            </span>
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 text-center mt-4">
            <div className="rounded-2xl bg-emerald-100/50 p-8 shadow-inner dark:bg-emerald-900/30 w-full border border-emerald-200/50 dark:border-emerald-800/50">
              <p className="text-2xl font-black tracking-tight text-emerald-950 dark:text-emerald-100 sm:text-3xl">
                {card.correction}
              </p>
            </div>
            <p className="max-w-lg text-base font-semibold leading-relaxed text-emerald-800/90 dark:text-emerald-200/90">
              {card.deepDive}
            </p>
          </div>
          <p className="relative z-10 flex items-center justify-center gap-2 text-sm font-bold text-emerald-500/70 transition-colors group-hover:text-emerald-600 dark:text-emerald-600 dark:group-hover:text-emerald-400">
            <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" /> Tap to flip back
          </p>
        </div>
      </motion.button>
    </div>
  );
}

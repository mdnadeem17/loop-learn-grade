import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import type { FlashcardData } from "./Flashcard";

const face = "absolute inset-0 flex flex-col rounded-md border bg-card p-8 shadow-sm [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

export function FlipCard({ card, isFlipped, onFlip }: { card: FlashcardData; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div className="[perspective:1600px]">
      <motion.button
        type="button"
        onClick={onFlip}
        aria-label={isFlipped ? "Show mistake" : "Show correction"}
        className="relative block h-[440px] w-full cursor-pointer text-left [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, mass: 1.2 }}
      >
        {/* Front */}
        <div className={face}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Fumbled topic: {card.topic}
            </span>
            {card.badge && (
              <span className="rounded-sm border border-warn/30 bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">
                {card.badge}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">You wrote:</p>
            <p className="mt-4 rounded-sm bg-mistake-soft px-6 py-4 text-2xl font-bold tracking-tight text-mistake sm:text-3xl">
              {card.wrote}
            </p>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" /> Tap card to flip
          </p>
        </div>
        {/* Back */}
        <div className={`${face} [transform:rotateY(180deg)]`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Model answer &amp; analysis
          </span>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <p className="rounded-sm bg-fix-soft px-6 py-4 text-2xl font-bold tracking-tight text-fix sm:text-3xl">
              {card.correction}
            </p>
            <p className="max-w-lg leading-relaxed text-muted-foreground">{card.deepDive}</p>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" /> Tap card to flip back
          </p>
        </div>
      </motion.button>
    </div>
  );
}

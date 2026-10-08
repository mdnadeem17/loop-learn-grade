import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type FlashcardData = {
  id: string;
  topic: string;
  badge?: string;
  wrote: string;
  correction: string;
  deepDive: string;
};

export function Flashcard({ card }: { card: FlashcardData }) {
  return (
    <Card className="gap-0 rounded-md border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{card.topic}</span>
        {card.badge && (
          <span className="rounded-sm border border-warn/30 bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">
            {card.badge}
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border-l-4 border-mistake bg-mistake-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-mistake">You wrote:</p>
          <p className="mt-1.5 font-medium text-mistake line-through decoration-mistake/40">{card.wrote}</p>
        </div>
        <div className="rounded-sm border-l-4 border-fix bg-fix-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-fix">Correction:</p>
          <p className="mt-1.5 font-semibold text-fix">{card.correction}</p>
        </div>
      </div>
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="deep" className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold">View More (Concept Deep Dive)</AccordionTrigger>
          <AccordionContent className="leading-relaxed text-muted-foreground">{card.deepDive}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

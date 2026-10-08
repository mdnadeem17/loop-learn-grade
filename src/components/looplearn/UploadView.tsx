import { useRef, useState } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadView({ onAnalyze }: { onAnalyze: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    setLoading(true);
    setTimeout(onAnalyze, 1500);
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Upload Your Answer Sheet</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Our AI will analyze your work and generate custom remediation flashcards.
      </p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0] ?? null); }}
        className={`mt-10 flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-card px-6 py-16 text-center transition-colors ${drag ? "border-foreground bg-muted" : "border-border"}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-foreground text-background">
          <FileText className="h-7 w-7" />
        </div>
        <p className="mt-5 font-semibold">{file ? file.name : "Drag & drop your answer sheet here"}</p>
        <p className="mt-1 text-sm text-muted-foreground">PDF, JPG or PNG up to 20MB</p>
        <Button variant="outline" className="mt-6 rounded-sm" onClick={() => inputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" /> Browse Files
        </Button>
        <input ref={inputRef} type="file" accept=".pdf,image/*" className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <Button size="lg" className="mt-6 h-14 w-full rounded-sm text-base font-semibold" onClick={analyze} disabled={loading}>
        {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing…</>) : "Analyze My Answers"}
      </Button>
    </div>
  );
}

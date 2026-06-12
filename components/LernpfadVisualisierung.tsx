type Props = {
  current?: "Berater" | "Sparringspartner" | "Strategischer Partner";
};

const steps = ["Berater", "Sparringspartner", "Strategischer Partner"] as const;

export function LernpfadVisualisierung({ current }: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="text-xl font-semibold text-primary">Lernpfad</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3 md:items-center">
        {steps.map((step, index) => {
          const isCurrent = current === step;

          return (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`flex h-16 flex-1 items-center justify-center rounded-2xl border text-center text-sm font-semibold ${
                  isCurrent
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {step}
              </div>
              {index < steps.length - 1 ? (
                <span className="hidden text-2xl text-accent md:inline">→</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CompletenessBar({ percent }: { percent: number }) {
  const color = percent >= 75 ? "bg-zf-success" : percent >= 50 ? "bg-[#c98a00]" : "bg-zf-red";
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-24 overflow-hidden rounded-full bg-zf-border"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Ficha completa"
      >
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-sm font-semibold tabular-nums text-zf-text">{percent}%</span>
    </div>
  );
}

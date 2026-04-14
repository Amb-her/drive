'use client';

interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function MacroProgress({ label, current, target, unit, color }: MacroProgressProps) {
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {Math.round(current)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="macro-bar">
        <div className={`macro-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

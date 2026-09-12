import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
};

export function Field({ id, label, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-[11px] tracking-[0.2em] text-muted uppercase">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const fieldControlClass =
  "h-11 w-full rounded-xl border border-white/10 bg-void/50 px-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus-visible:border-heartlight/50";

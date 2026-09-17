import { UniandesLogo } from "./UniandesLogo";

/**
 * "Firma de unidad" per the brand manual (sec. 4.5): official logo + a
 * vertical divider + the unit name — the sanctioned way to identify a lab or
 * department, since the manual (sec. 2.4.2) explicitly forbids creating a
 * separate logo for research groups/labs/initiatives.
 */
export function UnitSignature({
  dark = false,
  compact = false,
  className,
  unitName = "Laboratorio SinergIA",
  unitSubtitle = "Ingeniería Civil y Ambiental",
}: {
  dark?: boolean;
  compact?: boolean;
  className?: string;
  /** Unit name next to the official logo — override for a sub-section that
   * needs its own identity (e.g. "Infraestructura Visible") without
   * creating a new logo mark (forbidden by manual sec. 2.4.2). */
  unitName?: string;
  unitSubtitle?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <UniandesLogo className="h-6 sm:h-7 w-auto shrink-0" fill={dark ? "#FFFFFF" : "#1F1F1C"} />
      <span className={`h-6 sm:h-7 w-px shrink-0 ${dark ? "bg-white/30" : "bg-black/20"}`} />
      <span className={`leading-tight ${dark ? "text-white" : "text-[#1F1F1C]"}`}>
        <span className="block text-sm sm:text-[15px] font-semibold">{unitName}</span>
        {!compact && (
          <span className={`block text-[11px] font-normal ${dark ? "text-white/60" : "text-foreground-secondary"}`}>
            {unitSubtitle}
          </span>
        )}
      </span>
    </div>
  );
}

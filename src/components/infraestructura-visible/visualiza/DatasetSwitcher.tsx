import type { LucideIcon } from "lucide-react";

export interface DatasetTabInfo {
  id: string;
  label: string;
  icon: LucideIcon;
}

export function DatasetSwitcher({
  options,
  activeId,
  onChange,
}: {
  options: DatasetTabInfo[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Capa de datos" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              isActive ? "bg-black border-black" : "bg-white border-border-soft hover:border-border-strong"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-yellow" : "text-black"}`} strokeWidth={1.75} />
            <span className={`text-[13px] font-medium ${isActive ? "text-white" : "text-black"}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { easeApple } from "@/lib/motion";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({
  items,
  groupId,
  label,
}: {
  items: TabItem[];
  /** Unique id so the sliding underline doesn't collide with another Tabs instance. */
  groupId: string;
  label: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const activeItem = items.find((item) => item.id === active) ?? items[0];

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-black/10 mb-10">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              id={`${groupId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${groupId}-panel-${item.id}`}
              onClick={() => setActive(item.id)}
              className={`relative pb-4 text-base font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm ${
                isActive ? "text-black" : "text-foreground-secondary hover:text-black"
              }`}
            >
              {item.label}
              {isActive && <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-yellow" />}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeItem?.id}
        id={`${groupId}-panel-${activeItem?.id}`}
        role="tabpanel"
        aria-labelledby={`${groupId}-tab-${activeItem?.id}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: easeApple }}
      >
        {activeItem?.content}
      </motion.div>
    </div>
  );
}

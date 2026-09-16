"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { easeApple } from "@/lib/motion";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

const AUTO_ADVANCE_MS = 6000;

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
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const activeItem = items.find((item) => item.id === active) ?? items[0];
  const autoAdvancing = !shouldReduceMotion && items.length > 1;
  const paused = hoverPaused || userPaused;

  // Auto-advance to the next tab, re-armed every time the active tab changes
  // (manually or automatically) so a click always buys a full interval before
  // it moves on. Pauses on hover/focus, on the explicit pause control, and
  // respects reduced-motion (WCAG 2.2.2: auto-updating content needs a way
  // to pause it).
  useEffect(() => {
    if (paused || !autoAdvancing) return;
    const timer = setTimeout(() => {
      setActive((current) => {
        const idx = items.findIndex((item) => item.id === current);
        return items[(idx + 1) % items.length].id;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, autoAdvancing, items]);

  return (
    <div onMouseEnter={() => setHoverPaused(true)} onMouseLeave={() => setHoverPaused(false)}>
      <div
        role="tablist"
        aria-label={label}
        onFocus={() => setHoverPaused(true)}
        onBlur={() => setHoverPaused(false)}
        className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-black/10 mb-10"
      >
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
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-black/10 overflow-hidden">
                  {autoAdvancing ? (
                    <span
                      key={active}
                      style={{
                        animation: `tab-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                      className="block h-full bg-yellow origin-left"
                    />
                  ) : (
                    <span className="block w-full h-full bg-yellow" />
                  )}
                </span>
              )}
            </button>
          );
        })}

        {autoAdvancing && (
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused ? "Reanudar avance automático" : "Pausar avance automático"}
            className="ml-auto mb-4 p-1.5 rounded-full text-foreground-secondary hover:text-black hover:bg-background-subtle transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {userPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        )}
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

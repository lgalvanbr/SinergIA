import { useEffect, type RefObject } from "react";

/** Plays the video only while its container is on screen — muted looping
 * clips that keep decoding off-screen burn CPU and battery for nothing. */
export function useVideoWhenVisible(
  containerRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!enabled || !container || !video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, videoRef, enabled]);
}

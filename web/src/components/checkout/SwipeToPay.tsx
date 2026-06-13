"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { formatPrice } from "@/lib/format";

const COMPLETE_RATIO = 0.82;

export function SwipeToPay({
  amount,
  onComplete,
  loading = false,
  disabled = false,
  label = "Swipe to pay securely",
}: {
  amount: number;
  onComplete: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const triggered = useRef(false);
  const isDraggingRef = useRef(false);
  const startX = useRef(0);
  const offsetX = useRef(0);
  const [dragPx, setDragPx] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const handle = handleRef.current;
    if (!track || !handle) return;
    setMaxDrag(Math.max(0, track.clientWidth - handle.clientWidth - 8));
  }, []);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, loading]);

  const reset = useCallback(() => {
    offsetX.current = 0;
    setDragPx(0);
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      triggered.current = false;
      queueMicrotask(reset);
    }
  }, [loading, reset]);

  const finishIfReady = useCallback(
    (px: number) => {
      if (maxDrag > 0 && px >= maxDrag * COMPLETE_RATIO) {
        if (triggered.current) return;
        triggered.current = true;
        offsetX.current = maxDrag;
        setDragPx(maxDrag);
        setIsDragging(false);
        onComplete();
        return;
      }
      reset();
    },
    [maxDrag, onComplete, reset],
  );

  const onPointerDown = useCallback(
    (clientX: number) => {
      if (disabled || loading || triggered.current) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      startX.current = clientX - offsetX.current;
    },
    [disabled, loading],
  );

  const onPointerMove = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current) return;
      const next = Math.min(maxDrag, Math.max(0, clientX - startX.current));
      offsetX.current = next;
      setDragPx(next);
    },
    [maxDrag],
  );

  const onPointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    finishIfReady(offsetX.current);
  }, [finishIfReady]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => onPointerMove(e.clientX);
    const onUp = () => onPointerUp();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [onPointerMove, onPointerUp]);

  const progress = maxDrag > 0 ? dragPx / maxDrag : 0;
  const showHint = !loading && progress < 0.2;

  return (
    <div className="space-y-2">
      <div className="mb-2 flex items-center justify-between px-1 text-mohasti-teal-dark">
        <span className="font-display text-lg">Total</span>
        <span className="text-xl font-bold tabular-nums">
          {formatPrice(amount)}
        </span>
      </div>

      <div
        ref={trackRef}
        className={`relative h-14 touch-pan-y overflow-hidden rounded-xl bg-mohasti-teal select-none ${
          disabled && !loading ? "opacity-50" : ""
        }`}
        aria-busy={loading}
        aria-live="polite"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2.5 px-4">
            <span
              className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
            <span className="text-sm font-medium text-white">
              Processing payment…
            </span>
          </div>
        ) : (
          <>
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-mohasti-cyan/50 to-mohasti-teal/80 transition-[width] duration-75"
              style={{ width: `${Math.min(100, progress * 100 + 14)}%` }}
              aria-hidden
            />

            {showHint && (
              <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 text-xs font-medium text-white/95 sm:px-16 sm:text-sm">
                <span className="line-clamp-2 text-center">{label}</span>
              </p>
            )}

            <button
              ref={handleRef}
              type="button"
              disabled={disabled}
              aria-label={label}
              className={`absolute left-1 top-1 flex h-[calc(100%-0.5rem)] w-12 touch-none items-center justify-center rounded-lg bg-white text-mohasti-teal shadow-md transition-shadow ${
                disabled
                  ? "cursor-not-allowed"
                  : "cursor-grab active:cursor-grabbing active:shadow-lg"
              }`}
              style={{
                transform: `translateX(${dragPx}px)`,
                transition: isDragging ? "none" : "transform 0.25s ease-out",
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                onPointerDown(e.clientX);
              }}
            >
              <ChevronIcon />
            </button>
          </>
        )}
      </div>

      <p className="text-center text-[11px] text-gray-500">
        {loading ? "Please wait while we confirm your payment" : "Drag the handle → to confirm payment"}
      </p>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="m9 6 6 6-6 6" />
      <path d="M4 6v12" opacity="0.35" />
    </svg>
  );
}

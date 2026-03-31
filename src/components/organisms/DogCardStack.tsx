import { useEffect, useRef, useState } from "react";
import type * as React from "react";

import { BreedMetaPanel } from "@/components/molecules/BreedMetaPanel";
import type { DogCard } from "@/interfaces/dog-card.interface";
import type { VoteValue } from "@/interfaces/vote.interface";

interface Props {
  currentCard: DogCard | null;
  nextCard: DogCard | null;
  disabled?: boolean;
  canOpenDetails?: boolean;
  metadata?: React.ReactNode;
  queuedSwipeValue?: VoteValue | null;
  onQueuedSwipeHandled?: () => void;
  onSwipe: (value: VoteValue) => void;
  onOpenDetails: (breedId: number) => void;
}

interface DragState {
  x: number;
  y: number;
  isThrowing: boolean;
  transition: string;
}

const swipeThreshold = 110;
/** Card fly-out after a button swipe or drag release; keep in sync with CSS transition below. */
const throwDurationMs = 900;
const throwTransition = `transform ${throwDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${throwDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${throwDurationMs}ms ease-out`;

/** Maps drag distance to 0..1 for peek-card scale, opacity, and badge strength. */
function getMotionIntensity(x: number, y: number): number {
  const distance = Math.sqrt(x * x + y * y);
  const maxDistance = 240;
  const normalized = distance / maxDistance;

  if (normalized > 1) {
    return 1;
  }

  if (normalized < 0) {
    return 0;
  }

  return normalized;
}

export function DogCardStack(props: Props) {
  const currentCard = props.currentCard;
  const canOpenDetails = props.canOpenDetails ?? true;
  const queuedSwipeValue = props.queuedSwipeValue;
  const onQueuedSwipeHandled = props.onQueuedSwipeHandled;
  const onSwipe = props.onSwipe;

  const [dragState, setDragState] = useState<DragState>({
    x: 0,
    y: 0,
    isThrowing: false,
    transition: "transform 180ms ease-out",
  });

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  function resetCardPosition() {
    setDragState({
      x: 0,
      y: 0,
      isThrowing: false,
      transition: "transform 180ms ease-out",
    });
  }

  /** Snap transform back with transition disabled so the next card does not animate from the throw pose. */
  function settleAfterSwipe() {
    setDragState({
      x: 0,
      y: 0,
      isThrowing: false,
      transition: "none",
    });
  }

  function handleSwipeDecision(value: VoteValue, isQueuedSwipe: boolean) {
    const outX = value === -1 ? -520 : value === 1 ? 520 : 0;
    const outY = value === 2 ? -520 : 80;

    setDragState({
      x: outX,
      y: outY,
      isThrowing: true,
      transition: throwTransition,
    });

    // Outer timeout matches the throw animation; inner `setTimeout(0)` defers `onSwipe` until after
    // React applies the reset transform so the incoming card mounts from a neutral position.
    window.setTimeout(() => {
      settleAfterSwipe();
      movedRef.current = false;

      window.setTimeout(() => {
        props.onSwipe(value);
        if (isQueuedSwipe && props.onQueuedSwipeHandled) {
          props.onQueuedSwipeHandled();
        }
      }, 0);
    }, throwDurationMs);
  }

  /** Super-like (2) wins when the drag is mostly upward; otherwise horizontal thresholds pick like/dislike. */
  function decideVoteValue(x: number, y: number): VoteValue | null {
    if (y < -swipeThreshold && Math.abs(y) > Math.abs(x)) {
      return 2;
    }

    if (x > swipeThreshold) {
      return 1;
    }

    if (x < -swipeThreshold) {
      return -1;
    }

    return null;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (props.disabled) {
      return;
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    movedRef.current = false;

    setDragState((previous) => {
      return {
        ...previous,
        isThrowing: false,
        transition: "none",
      };
    });

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!pointerStartRef.current || props.disabled) {
      return;
    }

    const deltaX = event.clientX - pointerStartRef.current.x;
    const deltaY = event.clientY - pointerStartRef.current.y;

    // Small jitter should still open details on tap; this threshold marks an intentional drag.
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      movedRef.current = true;
    }

    setDragState({
      x: deltaX,
      y: deltaY,
      isThrowing: false,
      transition: "none",
    });
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLElement>) {
    if (!pointerStartRef.current) {
      return;
    }

    const pointerStart = pointerStartRef.current;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    const decision = decideVoteValue(deltaX, deltaY);
    pointerStartRef.current = null;

    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!decision) {
      resetCardPosition();
      return;
    }

    handleSwipeDecision(decision, false);
  }

  function handleCardClick() {
    if (
      !canOpenDetails ||
      !props.currentCard ||
      movedRef.current ||
      props.disabled
    ) {
      return;
    }

    props.onOpenDetails(props.currentCard.breedId);
  }

  // Toolbar/button swipes set `queuedSwipeValue` instead of pointer events; mirror the same animation
  // and timing as `handleSwipeDecision`. Skip while a pointer gesture is active to avoid double-firing.
  useEffect(() => {
    if (!queuedSwipeValue || !currentCard) {
      return;
    }

    if (pointerStartRef.current) {
      return;
    }

    const queuedValue = queuedSwipeValue;
    let settleTimer: number | undefined;
    // `setTimeout(0)` yields until after commit so state from the click handler is stable.
    const kickoffTimer = window.setTimeout(() => {
      const outX = queuedValue === -1 ? -520 : queuedValue === 1 ? 520 : 0;
      const outY = queuedValue === 2 ? -520 : 80;

      setDragState({
        x: outX,
        y: outY,
        isThrowing: true,
        transition: throwTransition,
      });

      settleTimer = window.setTimeout(() => {
        settleAfterSwipe();
        movedRef.current = false;

        window.setTimeout(() => {
          onSwipe(queuedValue);
          if (onQueuedSwipeHandled) {
            onQueuedSwipeHandled();
          }
        }, 0);
      }, throwDurationMs);
    }, 0);

    return () => {
      window.clearTimeout(kickoffTimer);
      if (settleTimer !== undefined) {
        window.clearTimeout(settleTimer);
      }
    };
  }, [queuedSwipeValue, currentCard, onSwipe, onQueuedSwipeHandled]);

  if (!props.currentCard) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-card text-center sm:h-[64svh] sm:max-h-[34rem] sm:min-h-[20rem] sm:rounded-3xl sm:border sm:border-border">
        <p className="text-sm text-muted-foreground">
          No more dogs in this feed.
        </p>
      </div>
    );
  }

  const rotation = dragState.x * 0.04;
  const motionIntensity = getMotionIntensity(dragState.x, dragState.y);
  // Underlay card eases forward as the top card moves, hinting the next item without layout shift.
  const nextCardScale = 0.94 + motionIntensity * 0.06;
  const nextCardTranslateY = 18 - motionIntensity * 18;
  const currentOpacity = dragState.isThrowing ? 0 : 1 - motionIntensity * 0.28;
  const currentSaturation = 1 + motionIntensity * 0.25;
  const showLike = dragState.x > 30;
  const showDislike = dragState.x < -30;
  const showSuper =
    dragState.y < -40 && Math.abs(dragState.y) > Math.abs(dragState.x);
  const badgeOpacity = 0.22 + motionIntensity * 0.78;

  return (
    <div className="relative h-full max-h-[calc(100svh-10.5rem)] min-h-[20rem] w-full touch-none overflow-hidden sm:mx-auto sm:h-[74svh] sm:max-h-[34rem] sm:min-h-[20rem] sm:max-w-md">
      {props.nextCard ? (
        <article
          className="absolute inset-0 bg-muted shadow-lg sm:rounded-3xl sm:border sm:border-border"
          style={{
            backgroundImage: props.nextCard.imageUrl
              ? `url(${props.nextCard.imageUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${nextCardTranslateY}px) scale(${nextCardScale})`,
            transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="absolute inset-0 bg-background/45 sm:rounded-3xl" />
        </article>
      ) : null}

      <article
        role={canOpenDetails ? "button" : undefined}
        tabIndex={canOpenDetails ? 0 : -1}
        aria-label={
          canOpenDetails
            ? `Open details for ${props.currentCard.breedName}`
            : undefined
        }
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (!canOpenDetails) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="absolute inset-0 cursor-grab bg-card shadow-2xl select-none active:cursor-grabbing sm:rounded-3xl sm:border sm:border-border"
        style={{
          transform: `translate(${dragState.x}px, ${dragState.y}px) rotate(${rotation}deg)`,
          transition: dragState.transition,
          opacity: currentOpacity,
          filter: `saturate(${currentSaturation})`,
          backgroundImage: props.currentCard.imageUrl
            ? `url(${props.currentCard.imageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/15 sm:rounded-3xl" />
        {showDislike ? (
          <span
            className="absolute top-7 right-2 rotate-[20deg] rounded-2xl border-[3px] border-destructive bg-destructive/85 px-4 py-2 text-base font-black tracking-[0.2em] text-destructive-foreground uppercase shadow-2xl shadow-destructive/35 backdrop-blur-sm sm:top-10 sm:right-4 sm:px-6 sm:py-3 sm:text-lg sm:tracking-[0.24em]"
            style={{ opacity: badgeOpacity }}
          >
            NOPE
          </span>
        ) : null}
        {showLike ? (
          <span
            className="absolute top-7 left-2 rotate-[-20deg] rounded-2xl border-[3px] border-success bg-success/85 px-4 py-2 text-base font-black tracking-[0.2em] text-success-foreground uppercase shadow-2xl shadow-success/35 backdrop-blur-sm sm:top-10 sm:left-4 sm:px-6 sm:py-3 sm:text-lg sm:tracking-[0.24em]"
            style={{ opacity: badgeOpacity }}
          >
            LIKE
          </span>
        ) : null}
        {showSuper ? (
          <span
            className="absolute top-4 left-1/2 -translate-x-1/2 rounded-lg border border-primary bg-primary/90 px-3 py-1.5 text-xs font-black tracking-[0.16em] text-primary-foreground uppercase shadow-xl shadow-primary/40 backdrop-blur-sm sm:top-5 sm:text-sm sm:tracking-wider"
            style={{ opacity: badgeOpacity }}
          >
            SUPER
          </span>
        ) : null}
        {props.metadata ? (
          props.metadata
        ) : (
          <BreedMetaPanel
            breedName={props.currentCard.breedName}
            temperamentList={props.currentCard.temperamentList}
          />
        )}
      </article>
    </div>
  );
}

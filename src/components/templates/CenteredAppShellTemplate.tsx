import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import { useLocation } from "react-router-dom";

import { ProgressSavedToast } from "@/components/atoms/ProgressSavedToast";
import { TopNav } from "@/components/molecules/TopNav";
import { cn } from "@/lib/utils";
import { useSwipeStore } from "@/stores/useSwipeStore";

interface CenteredAppShellTemplateProps {
  children: React.ReactNode;
}

export function CenteredAppShellTemplate(props: CenteredAppShellTemplateProps) {
  const location = useLocation();
  const isCardLayoutPage =
    location.pathname === "/" || location.pathname.startsWith("/dogs/");
  const swipeFeedbackSignal = useSwipeStore(
    (state) => state.swipeFeedbackSignal,
  );
  const lastSwipeFeedbackValue = useSwipeStore(
    (state) => state.lastSwipeFeedbackValue,
  );
  const [isProgressSavedToastVisible, setIsProgressSavedToastVisible] =
    useState(false);
  const hideToastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (swipeFeedbackSignal <= 0) {
      return;
    }

    if (hideToastTimerRef.current !== null) {
      window.clearTimeout(hideToastTimerRef.current);
    }

    const showTimerId = window.setTimeout(() => {
      setIsProgressSavedToastVisible(true);
    }, 0);
    hideToastTimerRef.current = window.setTimeout(() => {
      setIsProgressSavedToastVisible(false);
      hideToastTimerRef.current = null;
    }, 1400);

    return () => {
      window.clearTimeout(showTimerId);
      if (hideToastTimerRef.current !== null) {
        window.clearTimeout(hideToastTimerRef.current);
        hideToastTimerRef.current = null;
      }
    };
  }, [swipeFeedbackSignal]);

  useEffect(() => {
    return () => {
      if (hideToastTimerRef.current !== null) {
        window.clearTimeout(hideToastTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <TopNav />
      <main
        className={cn(
          "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col",
          isCardLayoutPage
            ? "overflow-hidden px-0 py-0 sm:px-4 sm:py-4"
            : "overflow-y-auto overscroll-y-contain px-4 py-6 sm:py-8",
        )}
      >
        {props.children}
      </main>
      <ProgressSavedToast
        isVisible={isProgressSavedToastVisible}
        swipeValue={lastSwipeFeedbackValue}
      />
    </div>
  );
}

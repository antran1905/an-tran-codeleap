import type * as React from "react";
import { useLocation } from "react-router-dom";

import { TopNav } from "@/components/molecules/TopNav";
import { cn } from "@/lib/utils";

interface CenteredAppShellTemplateProps {
  children: React.ReactNode;
}

export function CenteredAppShellTemplate(props: CenteredAppShellTemplateProps) {
  const location = useLocation();
  const isCardLayoutPage = location.pathname === "/" || location.pathname.startsWith("/dogs/");

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
    </div>
  );
}

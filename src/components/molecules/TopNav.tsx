import { Heart, History, House } from "lucide-react";
import type * as React from "react";
import { Link, NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

interface TopNavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const topNavItems: TopNavItem[] = [
  { to: "/", label: "Home", icon: <House size={18} /> },
  { to: "/history", label: "History", icon: <History size={18} /> },
  { to: "/favorites", label: "Favorites", icon: <Heart size={18} /> },
];

export function TopNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="focus-visible:ring-ring shrink-0 rounded-md ring-offset-background transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <img
            alt="DogFinder"
            className="h-12 max-h-16 w-auto max-w-[min(100%,22rem)] object-contain object-left sm:h-14"
            src="/dog-finder-logo.webp"
          />
        </Link>
        <ul className="flex items-center gap-2">
          {topNavItems.map((item) => {
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={(navProps) => {
                    return cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-card hover:text-foreground hover:shadow-lg hover:shadow-primary/25",
                      navProps.isActive &&
                        "border-border bg-card text-foreground shadow-lg shadow-primary/25",
                    );
                  }}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

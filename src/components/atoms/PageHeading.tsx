import type * as React from 'react';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeading(props: PageHeadingProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{props.title}</h1>
        {props.subtitle ? <p className="text-sm text-muted-foreground">{props.subtitle}</p> : null}
      </div>
      {props.action}
    </header>
  );
}

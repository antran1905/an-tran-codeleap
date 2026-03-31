import type * as React from 'react';

import { PageHeading } from '@/components/atoms/PageHeading';

interface ListPageTemplateProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function ListPageTemplate(props: ListPageTemplateProps) {
  return (
    <section className="space-y-5">
      <PageHeading title={props.title} subtitle={props.subtitle} action={props.action} />
      {props.children}
    </section>
  );
}

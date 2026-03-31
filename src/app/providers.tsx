import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { RouterProvider } from 'react-router-dom';

import { appRouter } from '@/routes';

const queryClient = new QueryClient();

interface AppProvidersProps {
  children?: React.ReactNode;
}

export function AppProviders(props: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
}

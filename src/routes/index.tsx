import { createBrowserRouter } from 'react-router-dom';

import { App } from '@/app/App';
import { DogDetailsPage } from '@/pages/DogDetailsPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { HomePage } from '@/pages/HomePage';
import { dogDetailsLoader } from '@/routes/loaders/dog-details.loader';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dogs/:dogId',
        element: <DogDetailsPage />,
        loader: dogDetailsLoader,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
    ],
  },
]);

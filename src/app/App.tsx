import { Outlet } from 'react-router-dom';

import { CenteredAppShellTemplate } from '@/components/templates/CenteredAppShellTemplate';

export function App() {
  return (
    <CenteredAppShellTemplate>
      <Outlet />
    </CenteredAppShellTemplate>
  );
}

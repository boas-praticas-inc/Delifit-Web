import { Outlet } from 'react-router-dom';

import { GestorSidebar } from './GestorSidebar';
import { Header } from './Header';

export function GestorLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header homeTo="/gestor/inicio" title="Delifit Gestor" />
      <div className="md:flex">
        <GestorSidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

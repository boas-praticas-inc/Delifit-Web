import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ClienteDetalhePage } from '../features/clientes/pages/ClienteDetalhePage';
import { ClienteFormPage } from '../features/clientes/pages/ClienteFormPage';
import { ClientesListPage } from '../features/clientes/pages/ClientesListPage';
import { RestauranteDetalhePage } from '../features/restaurantes/pages/RestauranteDetalhePage';
import { RestauranteFormPage } from '../features/restaurantes/pages/RestauranteFormPage';
import { RestaurantesPage } from '../features/restaurantes/pages/RestaurantesPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/clientes" element={<ClientesListPage />} />
        <Route path="/clientes/novo" element={<ClienteFormPage />} />
        <Route path="/clientes/:id" element={<ClienteDetalhePage />} />
        <Route path="/clientes/:id/editar" element={<ClienteFormPage />} />
        <Route path="/restaurantes" element={<RestaurantesPage />} />
        <Route path="/restaurantes/novo" element={<RestauranteFormPage />} />
        <Route path="/restaurantes/:id" element={<RestauranteDetalhePage />} />
        <Route path="/restaurantes/:id/editar" element={<RestauranteFormPage />} />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/usuarios" element={<Navigate to="/clientes" replace />} />
      <Route path="/usuarios/novo" element={<Navigate to="/clientes/novo" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

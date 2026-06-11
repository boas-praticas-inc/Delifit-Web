import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { PedidosPage } from '../features/pedidos/pages/PedidosPage';
import { CriarRestaurantePage } from '../features/restaurantes/pages/CriarRestaurantePage';
import { EditarRestaurantePage } from '../features/restaurantes/pages/EditarRestaurantePage';
import { RestaurantesPage } from '../features/restaurantes/pages/RestaurantesPage';
import { CriarUsuarioPage } from '../features/usuarios/pages/CriarUsuarioPage';
import { UsuariosListPage } from '../features/usuarios/pages/UsuariosListPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/usuarios" element={<UsuariosListPage />} />
        <Route path="/usuarios/novo" element={<CriarUsuarioPage />} />
        <Route path="/restaurantes" element={<RestaurantesPage />} />
        <Route path="/restaurantes/novo" element={<CriarRestaurantePage />} />
        <Route
          path="/restaurantes/:restauranteId/editar"
          element={<EditarRestaurantePage />}
        />
        <Route path="/pedidos" element={<PedidosPage />} />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

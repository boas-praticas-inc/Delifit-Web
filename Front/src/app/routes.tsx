import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ClienteDetalhePage } from '../features/clientes/pages/ClienteDetalhePage';
import { ClientesListPage } from '../features/clientes/pages/ClientesListPage';
import { CriarClientePage } from '../features/clientes/pages/CriarClientePage';
import { EditarClientePage } from '../features/clientes/pages/EditarClientePage';
import { CriarRestaurantePage } from '../features/restaurantes/pages/CriarRestaurantePage';
import { EditarRestaurantePage } from '../features/restaurantes/pages/EditarRestaurantePage';
import { RestauranteDetalhePage } from '../features/restaurantes/pages/RestauranteDetalhePage';
import { RestaurantesPage } from '../features/restaurantes/pages/RestaurantesPage';
import { SolicitacoesPage } from '../features/solicitacoes/pages/SolicitacoesPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/solicitacoes" element={<SolicitacoesPage />} />
        <Route path="/clientes" element={<ClientesListPage />} />
        <Route path="/clientes/novo" element={<CriarClientePage />} />
        <Route path="/clientes/:clienteId" element={<ClienteDetalhePage />} />
        <Route path="/clientes/:clienteId/editar" element={<EditarClientePage />} />
        <Route path="/restaurantes" element={<RestaurantesPage />} />
        <Route path="/restaurantes/novo" element={<CriarRestaurantePage />} />
        <Route path="/restaurantes/:restauranteId" element={<RestauranteDetalhePage />} />
        <Route
          path="/restaurantes/:restauranteId/editar"
          element={<EditarRestaurantePage />}
        />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

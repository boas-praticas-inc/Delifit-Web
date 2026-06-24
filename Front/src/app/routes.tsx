import { Navigate, Route, Routes } from 'react-router-dom';

import { GestorLayout } from '../components/layout/GestorLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { AdminPrincipalRoute } from '../features/auth/components/AdminPrincipalRoute';
import { GestorRoute } from '../features/auth/components/GestorRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ClienteDetalhePage } from '../features/clientes/pages/ClienteDetalhePage';
import { ClientesListPage } from '../features/clientes/pages/ClientesListPage';
import { CriarClientePage } from '../features/clientes/pages/CriarClientePage';
import { EditarClientePage } from '../features/clientes/pages/EditarClientePage';
import { GestorAvaliacoesPage } from '../features/gestor/pages/GestorAvaliacoesPage';
import { GestorCardapioPage } from '../features/gestor/pages/GestorCardapioPage';
import { GestorEditarItemCardapioPage } from '../features/gestor/pages/GestorEditarItemCardapioPage';
import { GestorFaturamentoPage } from '../features/gestor/pages/GestorFaturamentoPage';
import { GestorInicioPage } from '../features/gestor/pages/GestorInicioPage';
import { GestorNovoItemCardapioPage } from '../features/gestor/pages/GestorNovoItemCardapioPage';
import { GestorPagamentoPage } from '../features/gestor/pages/GestorPagamentoPage';
import { GestorPerfilPage } from '../features/gestor/pages/GestorPerfilPage';
import { CriarRestaurantePage } from '../features/restaurantes/pages/CriarRestaurantePage';
import { EditarRestaurantePage } from '../features/restaurantes/pages/EditarRestaurantePage';
import { RestauranteDetalhePage } from '../features/restaurantes/pages/RestauranteDetalhePage';
import { RestaurantesPage } from '../features/restaurantes/pages/RestaurantesPage';
import { SolicitarAdesaoPage } from '../features/solicitacoes/pages/SolicitarAdesaoPage';
import { SolicitacoesPage } from '../features/solicitacoes/pages/SolicitacoesPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/solicitar-adesao" element={<SolicitarAdesaoPage />} />

      <Route element={<GestorRoute />}>
        <Route element={<GestorLayout />}>
          <Route
            path="/gestor"
            element={<Navigate to="/gestor/inicio" replace />}
          />
          <Route path="/gestor/inicio" element={<GestorInicioPage />} />
          <Route path="/gestor/cardapio" element={<GestorCardapioPage />} />
          <Route
            path="/gestor/cardapio/novo"
            element={<GestorNovoItemCardapioPage />}
          />
          <Route
            path="/gestor/cardapio/:itemId/editar"
            element={<GestorEditarItemCardapioPage />}
          />
          <Route path="/gestor/perfil" element={<GestorPerfilPage />} />
          <Route
            path="/gestor/faturamento"
            element={<GestorFaturamentoPage />}
          />
          <Route path="/gestor/avaliacoes" element={<GestorAvaliacoesPage />} />
          <Route path="/gestor/pagamento" element={<GestorPagamentoPage />} />
        </Route>
      </Route>

      <Route element={<AdminPrincipalRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/solicitacoes" element={<SolicitacoesPage />} />
          <Route path="/clientes" element={<ClientesListPage />} />
          <Route path="/clientes/novo" element={<CriarClientePage />} />
          <Route path="/clientes/:clienteId" element={<ClienteDetalhePage />} />
          <Route path="/clientes/:clienteId/editar" element={<EditarClientePage />} />
          <Route path="/restaurantes" element={<RestaurantesPage />} />
          <Route path="/restaurantes/novo" element={<CriarRestaurantePage />} />
          <Route
            path="/restaurantes/:restauranteId"
            element={<RestauranteDetalhePage />}
          />
          <Route
            path="/restaurantes/:restauranteId/editar"
            element={<EditarRestaurantePage />}
          />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

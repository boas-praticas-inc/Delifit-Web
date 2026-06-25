import { getUsuarioLogado } from '../../auth/utils/session';
import { gestorService } from '../../gestores/services/gestorService';
import type { Gestor } from '../../gestores/types/gestorTypes';
import { restauranteService } from '../../restaurantes/services/restauranteService';
import type { Restaurante } from '../../restaurantes/types/restauranteTypes';

export interface GestorContexto {
  gestor: Gestor | null;
  restaurante: Restaurante | null;
}

export const gestorContextoService = {
  async buscarContextoAtual(): Promise<GestorContexto> {
    const usuario = getUsuarioLogado();

    if (!usuario || usuario.tipo_usuario !== 'GESTOR') {
      throw new Error('Faça login como gestor para acessar esta área.');
    }

    const [gestores, restaurantes] = await Promise.all([
      gestorService.listarGestores(),
      restauranteService.listarRestaurantes(),
    ]);

    const gestor = gestores.find((item) => item.usuario_id === usuario.id) ?? null;
    const restaurante = gestor
      ? restaurantes.find((item) => item.gestor_id === gestor.id) ?? null
      : null;

    return { gestor, restaurante };
  },
};

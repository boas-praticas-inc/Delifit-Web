import { api } from '../../../lib/api';
import type { PastaUpload, UploadImagemResponse } from '../types/uploadTypes';

export const uploadService = {
  async enviarImagem(
    arquivo: File,
    pasta: PastaUpload,
    accessToken?: string,
  ) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('pasta', pasta);

    const response = await api.post<UploadImagemResponse>('/uploads/imagens', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    return response.data;
  },
};

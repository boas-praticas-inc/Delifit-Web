export type PastaUpload =
  | 'restaurantes'
  | 'itens-cardapio'
  | 'clientes'
  | 'gestores';

export interface UploadImagemResponse {
  bucket: string;
  chave: string;
  url: string;
  content_type: string;
}

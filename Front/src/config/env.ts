const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    'VITE_API_URL nao foi definida. Crie um arquivo .env com base no .env.example.',
  );
}

export const env = {
  apiUrl,
};

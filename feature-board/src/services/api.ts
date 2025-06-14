import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const ideaService = {
  getIdeas: async () => {
    try {
      const response = await api.get('/ideas');
      console.log('Dados recebidos:', response.data);
      return response;
    } catch (error) {
      console.error('Erro ao buscar ideias:', error);
      return { data: [] }; // Retorna array vazio em caso de erro
    }
  },
  voteIdea: (id: number) => api.post(`/ideas/${id}/vote`).catch(error => {
    console.error('Erro ao votar:', error);
    throw error;
  })
};

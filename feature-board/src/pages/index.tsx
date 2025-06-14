import { GetServerSideProps } from 'next';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ideaService } from '../services/api';

interface Idea {
  id: number;
  title: string;
  description: string;
  votes: number;
}

const fetcher = () => ideaService.getIdeas().then(res => res.data);

export default function Home({ initialIdeas }: { initialIdeas: Idea[] }) {
  const [votingId, setVotingId] = useState<number | null>(null);
  const { data: ideas = initialIdeas, mutate } = useSWR('/ideas', fetcher);

  console.log('Ideas recebidas:', ideas); // Debug

  // Se não há dados, mostra mensagem
  if (!ideas || ideas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Mural de ideias</h1>
          <p className="text-gray-600">Nenhuma ideia cadastrada ainda.</p>
        </div>
      </div>
    );
  }

  const handleVote = async (id: number) => {
    try {
      setVotingId(id);
      // Otimistic update
      const updatedIdeas = ideas.map(idea => 
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      );
      mutate(updatedIdeas, false);
      
      await ideaService.voteIdea(id);
      await mutate(); // Revalidate data
    } catch (error) {
      console.error('Erro ao votar:', error);
      // Reverter otimistic update em caso de erro
      mutate();
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Feature Board</h1>
        {console.log('Renderizando ideas:', ideas)}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(ideas) && ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{idea.title}</h2>
              <p className="text-gray-600 mb-4">{idea.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  {idea.votes} votos
                </span>
                <button
                  onClick={() => handleVote(idea.id)}
                  disabled={votingId === idea.id}
                  className={`${
                    votingId === idea.id
                      ? 'bg-blue-300'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-4 py-2 rounded-md transition-colors`}
                >
                  {votingId === idea.id ? 'Votando...' : 'Votar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data } = await ideaService.getIdeas();
    return { props: { initialIdeas: data } };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return { props: { initialIdeas: [] } };
  }
};

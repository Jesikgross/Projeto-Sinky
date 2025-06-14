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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mural de Ideias</h1>
          <p className="text-lg text-gray-600">Vote nas melhores ideias para nosso produto</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(ideas) && ideas.map((idea) => (
            <div key={idea.id} 
                 className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{idea.title}</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {idea.votes} votos
                </span>
              </div>
              <p className="text-gray-600 mb-6 min-h-[60px]">{idea.description}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleVote(idea.id)}
                  disabled={votingId === idea.id}
                  className={`
                    ${votingId === idea.id 
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                    } 
                    transform transition-all duration-200
                    text-white px-6 py-2 rounded-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                >
                  {votingId === idea.id ? 
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Votando...
                    </span>
                    : 'Votar'
                  }
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

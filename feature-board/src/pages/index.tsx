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

  const cardColors = [
    'border-blue-400',
    'border-purple-400',
    'border-pink-400',
    'border-green-400',
    'border-yellow-400',
    'border-red-400'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <header className="text-center mb-14">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Mural de Ideias
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vote nas melhores ideias para nosso produto 🚀
          </p>
        </header>

        {/* Grid de Ideias */}
        <div className="flex flex-wrap gap-6 justify-center mb-16">
          {Array.isArray(ideas) &&
            ideas.map((idea, index) => (
              <div
                key={idea.id}
                className={`
                  flex flex-col w-96
                  border-4 ${cardColors[index % cardColors.length]}
                  rounded-2xl bg-white shadow-lg
                  hover:shadow-xl hover:scale-105
                  transition-all duration-300 p-6
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{idea.title}</h2>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                    {idea.votes} votos
                  </span>
                </div>
                <p className="text-gray-600 text-lg mb-6 flex-grow">
                  {idea.description}
                </p>
                <button
                  onClick={() => handleVote(idea.id)}
                  disabled={votingId === idea.id}
                  className={`
                    w-full mt-4
                    ${votingId === idea.id
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                    }
                    text-white text-lg font-bold
                    px-6 py-3 rounded-xl
                    transform transition-all duration-200
                    ${!votingId && "hover:scale-105"}
                  `}
                >
                  {votingId === idea.id ? "Votando..." : "Votar"}
                </button>
              </div>
            ))}
        </div>

        {/* Ranking */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">🏆 Ranking</h2>
          <div className="space-y-3">
            {[...ideas]
              .sort((a, b) => b.votes - a.votes)
              .map((idea, index) => (
                <div
                  key={idea.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl
                    ${index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' :
                      index === 1 ? 'bg-gray-100 border-2 border-gray-400' :
                      index === 2 ? 'bg-orange-100 border-2 border-orange-400' :
                      'bg-white border border-gray-200'
                    }
                    hover:shadow-md transition-shadow
                  `}
                >
                  <div className="flex items-center gap-3 flex-grow">
                    <span className={`
                      text-xl font-bold
                      ${index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-500' :
                        index === 2 ? 'text-orange-500' :
                        'text-blue-500'
                      }
                    `}>
                      {index + 1}°
                    </span>
                    <span className="font-bold text-lg">{idea.title}:</span>
                    <span className="text-gray-600 ml-2">
                      {idea.votes} {idea.votes === 1 ? 'voto' : 'votos'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
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

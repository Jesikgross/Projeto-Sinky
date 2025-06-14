import { createConnection } from 'typeorm';
import { Idea } from '../ideas/ideas.entity';

async function seed() {
  const connection = await createConnection({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Idea],
    synchronize: true,
  });

  const ideias = [
    {
      title: 'Chat em Tempo Real',
      description: 'Implementar sistema de chat para suporte ao cliente',
      votes: 0
    },
    {
      title: 'Página de Relatórios',
      description: 'Criar dashboard com gráficos e métricas importantes',
      votes: 0
    },
    {
      title: 'Integração com PIX',
      description: 'Adicionar pagamentos via PIX no checkout',
      votes: 0
    },
    {
      title: 'Sistema de Notificações',
      description: 'Enviar alertas por email e push notification',
      votes: 0
    }
  ];

  const ideaRepository = connection.getRepository(Idea);
  
  for (const ideia of ideias) {
    await ideaRepository.save(ideia);
    console.log(`Ideia criada: ${ideia.title}`);
  }

  await connection.close();
  console.log('Ideias cadastradas com sucesso!');
}

seed().catch(console.error);

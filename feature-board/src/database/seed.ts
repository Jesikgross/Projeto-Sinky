import { createConnection } from 'typeorm';
import { Idea } from '../ideas/ideas.entity';

async function seed() {
  const connection = await createConnection({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Idea],
    synchronize: true,
  });

  try {
    // Limpar completamente o banco
    const ideaRepository = connection.getRepository(Idea);
    await ideaRepository.query('DELETE FROM idea');
    await ideaRepository.query('DELETE FROM sqlite_sequence');
    console.log('Banco de dados limpo');

    const ideias = [
      {
        title: 'App Mobile',
        description: 'Desenvolver versão mobile do sistema',
        votes: 0
      },
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
    
    // Garantir inserção única
    for (const ideia of ideias) {
      const exists = await ideaRepository.findOne({ where: { title: ideia.title }});
      if (!exists) {
        await ideaRepository.save(ideia);
        console.log(`Ideia criada: ${ideia.title}`);
      }
    }

    console.log('Ideias cadastradas com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar ideias:', error);
  } finally {
    await connection.close();
  }
}

seed();

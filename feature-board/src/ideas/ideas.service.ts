import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './ideas.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';

//permite gerenciar as ideias com o banco de dados
@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideasRepository: Repository<Idea>,
  ) {}

  //retorna todas as ideias
  async findAll(): Promise<Idea[]> {
    return this.ideasRepository.find();
  }

    //incrementa os votos de uma ideia específica
  async incrementVotes(id: number): Promise<Idea> {
    const idea = await this.ideasRepository.findOne({ where: { id } });
    if (!idea) {
      throw new NotFoundException('Idea not found');
    }
    idea.votes += 1;
    return this.ideasRepository.save(idea);
  }

  async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
    const idea = this.ideasRepository.create({
      ...createIdeaDto,
      votes: 0
    }) as Idea;
    return this.ideasRepository.save(idea);
  }
}
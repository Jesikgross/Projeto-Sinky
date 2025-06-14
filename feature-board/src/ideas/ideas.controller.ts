import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeasService } from './ideas.service';

//gerencia as rotas relacionadas às ideias

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  //lista todas as ideias
  @Get()
  async findAll() {
    return this.ideasService.findAll();
  }

  //incrementa votos de uma ideia específica
  @Post(':id/vote')
  async voteIdea(@Param('id') id: number) {
    return this.ideasService.incrementVotes(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createIdea(@Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(createIdeaDto);
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { Idea } from './ideas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea])],
  controllers: [IdeasController],
  providers: [IdeasService],
})
export class IdeasModule {}
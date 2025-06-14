import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeasModule } from './ideas/ideas.module';
import { Idea } from './ideas/ideas.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Idea],
      synchronize: true, // Atenção: usar false em produção
    }),
    IdeasModule,
  ],
})
export class AppModule {}
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

//armazena as ideias no banco de dados
@Entity()
export class Idea {
  @PrimaryGeneratedColumn()
  id: number =0;

  @Column()
  title: string = '';

  @Column({ default: 0 })
  votes: number = 0;
}
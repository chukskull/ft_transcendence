import { User } from 'src/user/user.entity';
import { Socket } from 'socket.io';
import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

  @Entity('match_history')
  export class MatchHistory {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    player1: number;

    @Column()
    player2: number;

    @Column()
    winner: number;

    @Column()
    loser: number;


    @Column()
    player1Score: number;
    
    @Column()
    player2Score: number;
    
    @Column()
    date: Date;
  }


import { Socket } from 'socket.io';
import { User } from 'src/user/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

  @Entity('match_history')
  export class MatchHistory {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Socket, (socket) => socket.id)
    player1: Socket;

    @ManyToOne(() => Socket, (socket) => socket.id)
    player2: Socket;

    @ManyToOne(() => Socket, (socket) => socket.id)
    winner: Socket;

    @ManyToOne(() => Socket, (socket) => socket.id)
    loser: Socket;


    @Column()
    player1Score: number;
    
    @Column()
    player2Score: number;
    
    @Column()
    date: Date;
  }

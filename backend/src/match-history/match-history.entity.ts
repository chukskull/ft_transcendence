import { User } from 'src/user/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, Entity, PrimaryColumn } from 'typeorm';

  @Entity('match_history')
  export class MatchHistory {
    @PrimaryColumn()
    id: number;
    
    @ManyToOne( () => User, user => user.id)
    player1: User;

    @ManyToOne( () => User, user => user.id)
    player2: User;

    @Column({ nullable: true })
    winner?: number;

    @Column()
    player1Score: number;
    
    @Column()
    player2Score: number;
    
    @Column()
    date: Date;
  }

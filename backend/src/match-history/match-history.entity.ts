import { User } from 'src/user/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('match_history')
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  player1: User;

  @ManyToOne(() => User)
  player2: User;

  @ManyToOne(() => User)
  winner: User;

  @Column()
  player1Score: number;

  @Column()
  player2Score: number;

  @Column()
  winsInARow: number;

  @Column()
  losesInARow: number;

  @Column()
  date: Date;
}

import { User } from "src/user/user.entity";
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('games')
export class Game {
  @PrimaryColumn()
  id: number;

  @Column()
  player1: User;

  @Column()
  player2 : User;

  @Column()
  status: "pending" | "active" | "finished";

  @Column()
  winnerId: string | null;

  @Column()
  customizationOptions: object;
}

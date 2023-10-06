import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Game {
  @PrimaryColumn()
  id: number;

  @Column()
  player1Id: string;

  @Column()
  player2Id: string;

  @Column()
  status: "pending" | "active" | "finished";

  @Column()
  winnerId: string | null;

  @Column()
  customizationOptions: object;
}

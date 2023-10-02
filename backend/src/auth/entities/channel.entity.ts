import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Channel {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: "public" | "private" | "password-protected";

  @Column()
  password: string | null;

  @Column()
  ownerId: string;

  @Column()
  administrators: string[];

  @Column()
  members: string[];
}

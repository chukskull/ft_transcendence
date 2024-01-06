import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['3 wins', '5 wins', '10 wins'],
    nullable: true,
  })
  name: string;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column()
  addedXp: number;
}

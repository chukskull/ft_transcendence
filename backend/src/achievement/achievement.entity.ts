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
    enum: ['3 in a row', '5 in a row', '10 in a row'],
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

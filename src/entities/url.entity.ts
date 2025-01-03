import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('url')
export class Url {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  longUrl: string;

  @Column()
  shortUrl: string;

  @Column({ nullable: true })
  customKey: string;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

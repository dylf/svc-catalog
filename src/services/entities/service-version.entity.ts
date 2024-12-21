import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Generated,
} from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class ServiceVersion {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  version: string;

  @Column('text')
  description: string;

  @Column()
  url: string;

  @ManyToOne(() => Service, (service) => service.versions)
  service: Service;

  // We would likely want to keep track of some meta information about the
  // entity created such as author, status, and timestamps.
  @Column({
    nullable: true,
  })
  author: string;

  @Column({
    default: 'published',
  })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

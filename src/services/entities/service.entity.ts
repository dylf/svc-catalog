import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
} from 'typeorm';
import { ServiceVersion } from './service-version.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  url: string;

  @OneToMany(() => ServiceVersion, (version) => version.service, {
    cascade: true,
  })
  versions: ServiceVersion[];

  // This would reference an organization entity.
  @Column({
    nullable: true,
  })
  organization?: string;

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

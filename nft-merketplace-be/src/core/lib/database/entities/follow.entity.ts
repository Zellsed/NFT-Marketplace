import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  BeforeUpdate,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follow')
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.following)
  following: UserEntity;

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

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}

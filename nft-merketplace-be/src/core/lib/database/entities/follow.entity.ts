import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follow')
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.following)
  following: UserEntity;
}

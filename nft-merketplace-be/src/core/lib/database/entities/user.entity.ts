import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInformationEntity } from './userInformation.entity';
import { Nft721Entity } from './nft721.entity';
import { FollowEntity } from './follow.entity';
import { LikeEntity } from './like.entity';
import { UserSpentEntity } from './userSpent.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'account',
    length: 255,
    nullable: false,
  })
  account: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'email',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'role',
    length: 255,
    default: 'user',
    nullable: true,
  })
  role: string;

  @Column({
    type: 'boolean',
    default: true,
    select: false,
  })
  active: boolean;

  @Column({
    name: 'password_reset_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordResetToken: string;

  @Column({
    name: 'password_reset_expires',
    type: 'timestamp',
    nullable: true,
  })
  passwordResetExpires: Date;

  @OneToOne(() => UserInformationEntity)
  information: UserInformationEntity;

  @OneToMany(() => UserSpentEntity, (spent) => spent.user)
  spent: UserSpentEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followers: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  following: FollowEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

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

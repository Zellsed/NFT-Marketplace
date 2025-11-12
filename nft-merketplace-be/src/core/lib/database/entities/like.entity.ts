import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  BeforeUpdate,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Nft721Entity } from './nft721.entity';

@Entity('like')
export class LikeEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'token_id',
    nullable: false,
  })
  tokenId: number;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  user: UserEntity;

  @ManyToOne(() => Nft721Entity, (nft) => nft.likes)
  nft: Nft721Entity;

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

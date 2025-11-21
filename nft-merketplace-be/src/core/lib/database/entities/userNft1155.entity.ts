import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Nft1155Entity } from './nft1155.entity';

@Entity('user_nft_1155')
export class UserNft1155Entity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'text',
    name: 'owner',
    nullable: false,
  })
  owner: string;

  @Column({
    type: 'int',
    name: 'token_id',
    nullable: false,
  })
  tokenId: number;

  @Column({
    type: 'float',
    name: 'amount',
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'float',
    name: 'amount_available',
    nullable: false,
  })
  amountAvailable: number;

  @Column({
    type: 'text',
    name: 'nft_contract',
    nullable: true,
  })
  nftContract: string;

  @Column({
    name: 'sold',
    type: 'boolean',
    default: false,
  })
  sold: boolean;

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

  @ManyToOne(() => UserEntity, (user) => user.nft1155s)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => Nft1155Entity, (nft) => nft.userNfts)
  @JoinColumn({ name: 'nft_id' })
  nft: Nft1155Entity;

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}
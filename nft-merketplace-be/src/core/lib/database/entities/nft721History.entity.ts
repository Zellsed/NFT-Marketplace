import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Nft721Entity } from './nft721.entity';
import { History } from 'src/common/enum';

@Entity('nf_721_history')
export class NftHistoryEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'enum',
    name: 'history_type',
    enum: History,
    nullable: true,
  })
  historyType: History;

  @Column({
    type: 'text',
    name: 'seller',
    nullable: true,
  })
  seller: string;

  @Column({
    type: 'text',
    name: 'owner',
    nullable: true,
  })
  owner: string;

  @Column({
    type: 'float',
    name: 'price',
    nullable: true,
  })
  price: number;

  @Column({
    type: 'int',
    name: 'token_id',
    nullable: true,
  })
  tokenId: number;

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

  @ManyToOne(() => Nft721Entity, (nft) => nft.history)
  @JoinColumn({ name: 'nft_id' })
  nft: Nft721Entity;
}

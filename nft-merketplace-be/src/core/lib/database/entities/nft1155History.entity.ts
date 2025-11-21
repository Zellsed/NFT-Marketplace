import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Nft1155Entity } from './nft1155.entity';
import { History } from 'src/common/enum';

@Entity('nft_1155_history')
export class Nft1155HistoryEntity {
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
    name: 'amount',
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'float',
    name: 'price',
    nullable: true,
  })
  price: number;

  @Column({
    type: 'float',
    name: 'total_price',
    nullable: false,
  })
  totalPrice: number;

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

  @ManyToOne(() => Nft1155Entity, (nft) => nft.history)
  @JoinColumn({ name: 'nft_id' })
  nft: Nft1155Entity;
}

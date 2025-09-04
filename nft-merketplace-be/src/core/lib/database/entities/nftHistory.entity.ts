import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { NftEntity } from './nft.entity';
import { History } from 'src/common/enum';

@Entity('nft-history')
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
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'text',
    name: 'owner',
    nullable: true,
  })
  owner: string;

  @Column({
    type: 'text',
    name: 'seller',
    nullable: true,
  })
  seller: string;

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

  @ManyToOne(() => NftEntity, (nft) => nft.history)
  @JoinColumn({ name: 'nft_id' })
  nft: NftEntity;
}

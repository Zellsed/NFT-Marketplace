import { CryptoLegend } from 'src/common/enum';
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
import { NftHistoryEntity } from './nft721History.entity';
import { LikeEntity } from './like.entity';
import { Nft1155MetadataEntity } from './nft1155Metadata.entity';
import { Nft1155HistoryEntity } from './nft1155History.entity';
import { UserNft1155Entity } from './userNft1155.entity';

@Entity('nft_1155')
export class Nft1155Entity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'item_id',
    nullable: false,
  })
  itemId: number;

  @Column({
    type: 'int',
    name: 'token_id',
    nullable: false,
  })
  tokenId: number;

  @Column({
    type: 'text',
    name: 'nft_contract',
    nullable: true,
  })
  nftContract: string;

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
    name: 'amount_available',
    nullable: false,
  })
  amountAvailable: number;

  @Column({
    type: 'float',
    name: 'price',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'float',
    name: 'total_price',
    nullable: false,
  })
  totalPrice: number;

  @Column({
    name: 'sold',
    type: 'boolean',
    default: false,
  })
  sold: boolean;

  @Column({
    type: 'text',
    name: 'tx_hash',
    nullable: true,
  })
  txHash: string;

  @Column({
    type: 'float',
    name: 'log_index',
    nullable: false,
  })
  logIndex: number;

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

  @OneToMany(() => Nft1155HistoryEntity, (history) => history.nft)
  history: Nft1155HistoryEntity[];

  @OneToMany(() => LikeEntity, (like) => like.nft1155)
  likes: LikeEntity[];

  @OneToOne(() => Nft1155MetadataEntity, (metadata) => metadata.nft)
  @JoinColumn({ name: 'metadata_id' })
  metadata: Nft1155MetadataEntity;

  @OneToMany(() => UserNft1155Entity, (userNft) => userNft.nft)
  userNfts: UserNft1155Entity[];
}

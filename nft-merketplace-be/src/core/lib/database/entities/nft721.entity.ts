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
import { Nft721MetadataEntity } from './nft721Metadata.entity';

@Entity('nft_721')
export class Nft721Entity {
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
    nullable: false,
  })
  price: number;

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

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => NftHistoryEntity, (history) => history.nft)
  history: NftHistoryEntity[];

  @OneToMany(() => LikeEntity, (like) => like.nft)
  likes: LikeEntity[];

  @OneToOne(() => Nft721MetadataEntity, (metadata) => metadata.nft)
  @JoinColumn({ name: 'metadata_id' })
  metadata: Nft721MetadataEntity;
}

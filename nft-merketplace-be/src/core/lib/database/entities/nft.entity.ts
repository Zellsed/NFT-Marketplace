import { CryptoLegend } from 'src/common/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { NftHistoryEntity } from './nftHistory.entity';
import { LikeEntity } from './like.entity';

@Entity('nft')
export class NftEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'float',
    name: 'price',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'text',
    name: 'description',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    name: 'pinata_data',
    nullable: true,
  })
  pinataData: string;

  @Column({
    type: 'enum',
    name: 'category',
    enum: CryptoLegend,
    nullable: true,
  })
  category: CryptoLegend;

  @Column({
    type: 'varchar',
    name: 'file_extension',
    length: 10,
    nullable: true,
  })
  fileExtension: string;

  @Column({
    type: 'varchar',
    name: 'file_size',
    length: 10,
    nullable: true,
  })
  fileSize: string;

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
    type: 'int',
    name: 'token_id',
    nullable: false,
  })
  tokenId: number;

  @Column({
    name: 'secret_nfts',
    type: 'boolean',
    default: false,
  })
  secretNfts: boolean;

  @ManyToOne(() => UserEntity, (user) => user.nfts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => NftHistoryEntity, (history) => history.nft)
  history: NftHistoryEntity[];

  @OneToMany(() => LikeEntity, (like) => like.nft)
  likes: LikeEntity[];
}

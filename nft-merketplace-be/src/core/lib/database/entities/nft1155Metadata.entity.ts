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
import { Nft1155Entity } from './nft1155.entity';

@Entity('nft_1155_metadata')
export class Nft1155MetadataEntity {
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
    name: 'token_uri',
    nullable: true,
  })
  tokenURI: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 255,
    nullable: false,
  })
  name: string;

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
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }

  @OneToOne(() => Nft1155Entity, (nft) => nft.metadata)
  nft: Nft1155Entity;
}

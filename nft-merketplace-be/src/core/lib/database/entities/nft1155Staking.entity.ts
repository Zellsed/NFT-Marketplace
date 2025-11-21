import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nft_1155_staking')
export class Nft1155StakingEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'text',
    name: 'staker:0',
    nullable: true,
  })
  staker: string;

  @Column({
    type: 'int',
    name: 'stake_id',
    nullable: false,
  })
  stakeId: number;

  @Column({
    type: 'int',
    name: 'token_id',
    nullable: false,
  })
  tokenId: number;

  @Column({
    type: 'float',
    name: 'price',
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'float',
    name: 'duration',
    nullable: false,
  })
  duration: number;

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

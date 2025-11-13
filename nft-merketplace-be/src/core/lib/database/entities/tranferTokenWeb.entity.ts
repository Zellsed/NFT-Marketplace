import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tranfer_token_web')
export class TranferTokenWebEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'text',
    name: 'user_address',
    nullable: true,
  })
  userAddress: string;

  @Column({
    type: 'text',
    name: 'base_coin',
    nullable: true,
  })
  baseCoin: string;

  @Column({
    type: 'float',
    name: 'base_coin_amount',
    nullable: false,
  })
  baseCoinAmount: number;

  @Column({
    type: 'float',
    name: 'web_token_amount',
    nullable: false,
  })
  webTokenAmount: number;

  @Column({
    type: 'text',
    name: 'transaction_hash',
    nullable: true,
  })
  transactionHash: string;

  @Column({
    type: 'float',
    name: 'log_index',
    nullable: false,
  })
  logIndex: number;

  @Column({
    type: 'float',
    name: 'block_number',
    nullable: false,
  })
  blockNumber: number;

  @Column({
    type: 'text',
    name: 'block_hash',
    nullable: true,
  })
  blockHash: string;

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
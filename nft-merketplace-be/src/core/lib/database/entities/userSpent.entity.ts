import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { SpentType } from "src/common/enum";

@Entity('user_spent')
export class UserSpentEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'float',
    name: 'spent',
    nullable: false,
  })
  spent: number;

  @Column({
    type: 'enum',
    name: 'spent_type',
    enum: SpentType,
    nullable: true,
  })
  spentType: SpentType;

  @ManyToOne(() => UserEntity, (user) => user.spent)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

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
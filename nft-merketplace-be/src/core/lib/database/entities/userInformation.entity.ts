import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user-information')
export class UserInformationEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'photo',
    length: 255,
    nullable: true,
  })
  photo: string;

  @Column({
    type: 'varchar',
    name: 'background',
    length: 255,
    nullable: true,
  })
  background: string;

  @Column({
    type: 'text',
    name: 'description',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    name: 'facebook',
    length: 255,
    nullable: true,
  })
  facebook: string;

  @Column({
    type: 'varchar',
    name: 'twitter',
    length: 255,
    nullable: true,
  })
  twitter: string;

  @Column({
    type: 'varchar',
    name: 'instagram',
    length: 255,
    nullable: true,
  })
  instagram: string;

  @OneToOne(() => UserEntity, (user) => user.information)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

import { EntityRepository, Repository } from 'typeorm';
import { UserSpentEntity } from '../entities';

@EntityRepository(UserSpentEntity)
export class UserSpentRepository extends Repository<UserSpentEntity> { }

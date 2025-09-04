import { EntityRepository, Repository } from 'typeorm';
import { FollowEntity } from '../entities/follow.entity';

@EntityRepository(FollowEntity)
export class FollowRepository extends Repository<FollowEntity> {}

import { EntityRepository, Repository } from 'typeorm';
import { LikeEntity } from '../entities/like.entity';

@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {}

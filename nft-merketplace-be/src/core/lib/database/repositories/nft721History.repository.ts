import { EntityRepository, Repository } from 'typeorm';
import { NftHistoryEntity } from '../entities';

@EntityRepository(NftHistoryEntity)
export class NftHistoryRepository extends Repository<NftHistoryEntity> {}

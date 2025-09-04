import { EntityRepository, Repository } from 'typeorm';
import { NftEntity } from '../entities/nft.entity';

@EntityRepository(NftEntity)
export class NFTRepository extends Repository<NftEntity> {}

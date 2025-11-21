import { EntityRepository, Repository } from 'typeorm';
import { Nft1155StakingEntity } from '../entities';

@EntityRepository(Nft1155StakingEntity)
export class NFT1155StakingRepository extends Repository<Nft1155StakingEntity> { }

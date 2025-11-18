import { EntityRepository, Repository } from 'typeorm';
import { Nft721StakingEntity } from '../entities';

@EntityRepository(Nft721StakingEntity)
export class NFT721StakingRepository extends Repository<Nft721StakingEntity> { }

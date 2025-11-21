import { EntityRepository, Repository } from 'typeorm';
import { Nft721Entity } from '../entities/nft721.entity';

@EntityRepository(Nft721Entity)
export class NFTRepository extends Repository<Nft721Entity> { }

import { EntityRepository, Repository } from 'typeorm';
import { Nft1155Entity } from '../entities';

@EntityRepository(Nft1155Entity)
export class NFT1155Repository extends Repository<Nft1155Entity> { }

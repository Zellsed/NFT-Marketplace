import { EntityRepository, Repository } from 'typeorm';
import { Nft721MetadataEntity } from '../entities';

@EntityRepository(Nft721MetadataEntity)
export class NFT721MetadataRepository extends Repository<Nft721MetadataEntity> { }

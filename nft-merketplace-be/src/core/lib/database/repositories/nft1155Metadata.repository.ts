import { EntityRepository, Repository } from 'typeorm';
import { Nft1155MetadataEntity } from '../entities';

@EntityRepository(Nft1155MetadataEntity)
export class NFT1155MetadataRepository extends Repository<Nft1155MetadataEntity> { }

import { EntityRepository, Repository } from 'typeorm';
import { Nft1155HistoryEntity } from '../entities';

@EntityRepository(Nft1155HistoryEntity)
export class Nft1155HistoryRepository extends Repository<Nft1155HistoryEntity> { }

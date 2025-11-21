import { EntityRepository, Repository } from 'typeorm';
import { UserNft1155Entity } from '../entities';

@EntityRepository(UserNft1155Entity)
export class UserNft1155Repository extends Repository<UserNft1155Entity> { }

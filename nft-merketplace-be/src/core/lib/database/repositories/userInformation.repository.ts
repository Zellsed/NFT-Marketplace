import { EntityRepository, Repository } from 'typeorm';
import { UserInformationEntity } from '../entities';

@EntityRepository(UserInformationEntity)
export class UserInformationRepository extends Repository<UserInformationEntity> {}

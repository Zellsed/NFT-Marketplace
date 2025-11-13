import { EntityRepository, Repository } from 'typeorm';
import { TranferTokenWebEntity } from '../entities';

@EntityRepository(TranferTokenWebEntity)
export class tranferTokenWebRepository extends Repository<TranferTokenWebEntity> { }

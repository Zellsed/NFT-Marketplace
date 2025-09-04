import { UserEntity } from '../lib/database/entities';

declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
      user?: UserEntity;
    }
  }
}

export {};

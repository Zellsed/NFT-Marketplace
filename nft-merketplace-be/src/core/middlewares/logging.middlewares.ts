import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Hey i am from middleware function');
    next();
  }

  getAll(req: Request, res: Response, next: NextFunction) {
    req.requestTime = new Date().toISOString();
    next();
  }
}

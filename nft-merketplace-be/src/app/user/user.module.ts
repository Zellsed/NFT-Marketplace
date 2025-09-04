import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import { AdminJwtStrategy } from 'src/core/guard/admin-jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserInformationEntity])],
  controllers: [UserController],
  providers: [UserService, AdminJwtStrategy],
})
export class UserModule {}

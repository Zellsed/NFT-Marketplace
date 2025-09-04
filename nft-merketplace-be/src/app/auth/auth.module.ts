import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { MailModule } from 'src/core/lib/mail';
import { AdminJwtStrategy } from 'src/core/guard/admin-jwt.guard';
import { UserInformationRepository } from 'src/core/lib/database/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserInformationEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MailModule,
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { Injectable } from '@nestjs/common';
import { createAuthDto } from './dto/createAuth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import {
  UserInformationRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import * as bcrypt from 'bcrypt';
import { loginAuthDto } from './dto/loginAuth.dto';
import { JwtService } from '@nestjs/jwt';
import { forgetPasswordDto } from './dto/forgetPassword.dto';
import * as crypto from 'crypto';
import { MailService } from '../../core/lib/mail/mail.service';
import { Request } from 'express';
import { MoreThan, Repository } from 'typeorm';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { updatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly UserInformationRepo: UserInformationRepository,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async singup(body: createAuthDto) {
    const existEmail = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (existEmail) {
      throw new Error('Email already exists');
    }

    if (body.password !== body.passwordConfirm) {
      throw new Error('Passwords do not match');
    }

    const existAccount = await this.userRepo.findOne({
      where: { account: body.account },
    });

    if (existAccount) {
      throw new Error('Account already exists');
    }

    body.password = await bcrypt.hash(body.password, 10);

    delete body.passwordConfirm;

    const user = await this.userRepo.save(body);

    const userInfo = new UserInformationEntity();
    userInfo.user = user;
    await this.UserInformationRepo.save(userInfo);

    delete user.password;

    delete user.passwordResetToken;
    delete user.passwordResetExpires;

    return user;
  }

  async login(body: loginAuthDto) {
    if (!body.currentAccount || !body.email || !body.password) {
      throw new Error('Account, Email and password are required');
    }

    const existAccount = await this.userRepo.findOne({
      where: { account: body.currentAccount.toLowerCase(), email: body.email },
    });

    if (!existAccount) {
      throw new Error('Account not found');
    }

    const existUser = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (!existUser) {
      throw new Error('User not found');
    }

    const checkPassword = await bcrypt.compare(
      body.password,
      existUser.password,
    );

    if (!checkPassword) {
      throw new Error('Invalid password');
    }

    const access_token = await this.createAccessToken(
      existUser.id,
      existUser.email,
      existUser.role,
    );

    delete existUser.password;
    // delete existUser.passwordChangedAt;
    delete existUser.passwordResetToken;
    delete existUser.passwordResetExpires;

    return {
      access_token,
      existUser,
    };
  }

  async forgetPassword(req: Request, body: forgetPasswordDto) {
    const existUser = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (!existUser) {
      throw new Error('Email not found');
    }

    const token = crypto.randomBytes(32).toString('hex');

    existUser.passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    existUser.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepo.save({ ...existUser });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${token}`;

    try {
      await this.mailService.sendTest(existUser.email, token, resetURL);
    } catch (error) {
      existUser.passwordResetToken = null;
      existUser.passwordResetExpires = null;

      await this.userRepo.save({ ...existUser });
    }
  }

  async resetPassword(token: string, body: resetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepo.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: MoreThan(new Date()),
    });

    if (!user) {
      throw new Error('Invalid token');
    }

    if (body.password !== body.passwordConfirm) {
      throw new Error('Passwords do not match');
    }

    const password = await bcrypt.hash(body.password, 10);

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.userRepo.save({ ...user });

    const access_token = await this.createAccessToken(
      user.id,
      user.email,
      user.role,
    );

    return {
      access_token,
    };
  }

  async updatePassword(userId: number, body: updatePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    const checkPassword = await bcrypt.compare(
      body.passwordCurrent,
      user.password,
    );

    if (!checkPassword) {
      throw new Error('Invalid password');
    }

    if (body.password !== body.passwordConfirm) {
      throw new Error('Passwords do not match');
    }

    const password = await bcrypt.hash(body.password, 10);

    user.password = password;
    await this.userRepo.save({ ...user });

    const access_token = await this.createAccessToken(
      user.id,
      user.email,
      user.role,
    );

    return { access_token };
  }

  async createAccessToken(id: number, email: string, role: string) {
    const payload = {
      id: id,
      emial: email,
      role: role,
    };

    return await this.jwtService.signAsync(payload);
  }
}

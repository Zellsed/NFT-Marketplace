import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import {
  UserInformationRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { updateUserdDto } from './dto/updateUser.dto';
import { accountDto } from './dto/account.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,
  ) {}

  async getAllUsers() {
    const allUser = await this.userRepo.find({ where: { active: true } });

    allUser.map((user) => {
      delete user.password,
        delete user.passwordResetToken,
        delete user.passwordResetExpires;
    });

    return {
      status: 'success',
      allUser,
    };
  }

  async checkAccount(body: accountDto) {
    const user = await this.userRepo.findOne({
      where: { account: body.account },
    });

    return { exists: !!user };
  }

  async getSingleUsers(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const userInfo = await this.userInformationRepo.findOne({
      where: { user: user.id },
    });

    if (!userInfo) {
      throw new Error('User Info not found');
    }

    return {
      status: 'success',
      user,
      userInfo,
    };
  }

  async getAccountDetails(account: string) {
    const user = await this.userRepo.findOne({
      where: { account: account.toLowerCase() },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userInformation = await this.userInformationRepo.findOne({
      where: { user: user.id },
    });

    if (!userInformation) {
      throw new Error('User Info not found');
    }

    return {
      user,
      userInformation,
    };
  }

  async updateUsers(userId: number, body: updateUserdDto) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    await this.userRepo.update(existUser.id, {
      name: body.name ? body.name : existUser.name,
    });

    const existUserInformation = await this.userInformationRepo.findOne({
      where: { user: existUser.id },
    });

    if (!existUserInformation) {
      throw new Error('User not found');
    }

    await this.userInformationRepo.update(existUserInformation.id, {
      photo: body.isImgUploading
        ? body.isImgUploading
        : existUserInformation.photo,
      background: body.background
        ? body.background
        : existUserInformation.background,
      description: body.description
        ? body.description
        : existUserInformation.description,
      facebook: body.facebook ? body.facebook : existUserInformation.facebook,
      twitter: body.twitter ? body.twitter : existUserInformation.twitter,
      instagram: body.instagram
        ? body.instagram
        : existUserInformation.instagram,
    });

    return {
      status: 'succeess',
    };
  }
}

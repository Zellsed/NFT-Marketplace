import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  UserInformationEntity,
  UserSpentEntity,
} from 'src/core/lib/database/entities';
import {
  UserInformationRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { updateUserdDto } from './dto/updateUser.dto';
import { accountDto } from './dto/account.dto';
import { UserSpentRepository } from 'src/core/lib/database/repositories/userSpent.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,

    @InjectRepository(UserSpentEntity)
    private readonly userSpentRepo: UserSpentRepository,
  ) { }

  async getAllUsers() {
    const allUser = await this.userRepo.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });

    allUser.map((user) => {
      delete user.password,
        delete user.passwordResetToken,
        delete user.passwordResetExpires;
    });

    const covertAllUser = await Promise.all(
      allUser.map(async (user) => {
        const existUserSpent = await this.userSpentRepo
          .createQueryBuilder('userSpent')
          .select('SUM(userSpent.spent)', 'totalSpent')
          .addSelect('COUNT(userSpent.id)', 'totalCount')
          .where('userSpent.user_id = :userId', { userId: user.id })
          .getRawOne();

        return {
          ...user,
          totalSpent: existUserSpent.totalSpent || 0,
          totalCount: existUserSpent.totalCount || 0,
        };
      }),
    );

    return {
      status: 'success',
      allUser: covertAllUser,
      count: allUser.length,
    };
  }

  async getAllTransaction(userId: number) {
    const existUserSpent = await this.userSpentRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    if (!existUserSpent) {
      return [];
    }

    return existUserSpent;
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
      where: { user: { id: user.id } },
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
      where: { user: { id: user.id } },
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
      where: { user: { id: existUser.id } },
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

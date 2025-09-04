import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../core/guard/auth.guard';
import { Request } from 'express';
import { updateUserdDto } from './dto/updateUser.dto';
import { accountDto } from './dto/account.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all-user')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post('check-account')
  async checkAccount(@Body() body: accountDto) {
    return await this.userService.checkAccount(body);
  }

  @Get('single-user')
  @UseGuards(AuthGuard)
  async getSingleUsers(@Req() req: Request) {
    return await this.userService.getSingleUsers(req.user.id);
  }

  @Get('account-details')
  async getAccountDetails(@Query('account') account: any) {
    return await this.userService.getAccountDetails(account);
  }

  @Patch('update-user')
  @UseGuards(AuthGuard)
  async updateUsers(@Req() req: Request, @Body() body: updateUserdDto) {
    return await this.userService.updateUsers(req.user.id, body);
  }
}

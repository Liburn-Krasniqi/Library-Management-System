import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import type { User } from 'generated/prisma/client'; // used type here?
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard) // this i moved outside so to have a guard on anything using the users controller
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getme(@GetUser('') user: User) {
    // dirty fix for now
    console.log({
      user: user.email,
    });
    return user;
  }

  @Get('all')
  getAllUsers(@GetUser('id') userId: string) {
    return this.userService.getAllNonAdmins(userId);
  }

  @Delete(':id')
  deleteUser(@GetUser('id') adminId: string, @Param('id') userId: string) {
    return this.userService.deleteUser(adminId, userId);
  }

  @Patch(':id')
  updateUser(
    @GetUser('id') adminId: string,
    @Param('id') userId: string,
    @Body() data: any,
  ) {
    return this.userService.updateProfile(adminId, userId, data);
  }
}

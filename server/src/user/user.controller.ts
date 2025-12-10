import { Controller, Get, UseGuards } from '@nestjs/common';
import type { User } from 'generated/prisma/client'; // used type here?
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard) // this i moved outside so to have a guard on anything using the users controller
@Controller('users')
export class UserController {
  @Get('me')
  getme(@GetUser('') user: User) {
    // dirty fix for now
    console.log({
      user: user.email,
    });
    return user;
  }
}

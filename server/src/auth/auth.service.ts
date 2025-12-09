import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);
    // save the user to db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });

    //return saved user
    return user;
  }

  login() {
    return { msg: 'signin' };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// model User {
//   id        String   @id @default(cuid())
//   email     String   @unique
//   name      String?
//   password  String   // Hash
//   role      Role     @default(USER)
//   books     Book[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   @@map("users")
// }
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /* =======================
     READ
  ======================= */
  async getAllNonAdmins(requesterId: string) {
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { role: true },
    });

    if (requester?.role !== Role.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    return this.prisma.user.findMany({
      where: {
        role: { not: Role.ADMIN },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getMe(userId: string) {
    return this.getUserById(userId);
  }

  async getUserRole(userId: string): Promise<Role> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) throw new NotFoundException('Requester not found');
    return user.role;
  }

  /* =======================
     UPDATE
  ======================= */

  async updateProfile(
    adminId: string,
    userId: string,
    data: {
      name?: string;
      email?: string;
    },
  ) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (admin?.role !== Role.ADMIN) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(adminId: string, targetUserId: string, role: Role) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (admin?.role !== Role.ADMIN) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role },
    });
  }

  /* =======================
     DELETE
  ======================= */

  async deleteUser(adminId: string, userId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (admin?.role !== Role.ADMIN) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}

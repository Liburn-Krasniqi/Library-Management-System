import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        ...dto,
        userId, // simpler than connect()
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const book = await this.prisma.book.findFirst({
      where: { id, userId },
    });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(userId: string, id: string, dto: UpdateBookDto) {
    await this.findOne(userId, id);

    return this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}

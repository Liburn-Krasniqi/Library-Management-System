import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseQuestion } from './parsers/rule.parser';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async handleQuery(question: string) {
    const intent = parseQuestion(question);

    switch (intent.type) {
      case 'MOST_BOOKS_OWNER':
        return this.mostBooksOwner();

      case 'MOST_POPULAR_BOOK':
        return this.mostPopularBook();

      //   case 'TOP_EXPENSIVE_BOOKS':
      //     return this.topExpensiveBooks(intent.limit);

      default:
        throw new BadRequestException('Unsupported question');
    }
  }

  async mostBooksOwner() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        _count: { select: { books: true } },
      },
      orderBy: { books: { _count: 'desc' } },
      take: 1,
    });
  }

  async mostPopularBook() {
    return this.prisma.book.groupBy({
      by: ['title'],
      _count: { title: true },
      orderBy: { _count: { title: 'desc' } },
      take: 1,
    });
  }

  //   async topExpensiveBooks(limit = 5) {
  //     return this.prisma.book.findMany({
  //       orderBy: { price: 'desc' },
  //       take: limit,
  //     });
  //   }
}

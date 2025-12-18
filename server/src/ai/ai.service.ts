import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseQuestion } from './parsers/rule.parser';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

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

  async translate(question: string, query: any) {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.get<string>('OpenRouterKey')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'xiaomi/mimo-v2-flash:free',
          messages: [
            {
              role: 'user',
              content: `User asked this question (in natural language): ${question}
And we queried the database which returned this: ${JSON.stringify(query)}.

Please use the question and the query results to create a short summary/response to their inquiry.`,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  //   async topExpensiveBooks(limit = 5) {
  //     return this.prisma.book.findMany({
  //       orderBy: { price: 'desc' },
  //       take: limit,
  //     });
  //   }
}

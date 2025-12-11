import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// model Book {
//   id            String       @id @default(cuid())
//   title         String
//   author        String
//   genre         String?
//   readingStatus ReadingStatus @default(READING)
//   userId        String
//   user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
//   createdAt     DateTime     @default(now())
//   updatedAt     DateTime     @updatedAt

//   @@index([userId])
//   @@map("books")
// }

// Use a dto instead of any for 'data'

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  // Create a new book for a specific user
  create(userId: string, data: any) {
    return this.prisma.book.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  // Get all books for a user
  findAll(userId: string) {
    return this.prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single book owned by the user
  async findOne(userId: string, id: string) {
    const book = await this.prisma.book.findFirst({
      where: { id, userId },
    });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  // Update a book (only if it belongs to the user)
  async update(userId: string, id: string, data: any) {
    // Ensure book exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  // Delete a book (only if it belongs to the user)
  async remove(userId: string, id: string) {
    // Ensure book exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}

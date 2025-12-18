// prisma/migrate-user-books.ts
// This script links existing user books to DisplayBooks by matching title and author

import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client.js';

const configService = new ConfigService();
const databaseUrl = configService.get<string>('DATABASE_URL');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function linkUserBooksToDisplayBooks() {
  console.log('Starting to link user books to DisplayBooks...');

  // Get all user books that don't have a bookId yet
  const userBooks = await prisma.book.findMany({
    where: {
      bookId: null,
    },
  });

  console.log(`Found ${userBooks.length} user books to link`);

  let linkedCount = 0;
  let notFoundCount = 0;

  for (const userBook of userBooks) {
    try {
      // Try to find matching DisplayBook
      const displayBook = await prisma.displayBook.findFirst({
        where: {
          title: {
            contains: userBook.title,
            mode: 'insensitive',
          },
          author: {
            contains: userBook.author,
            mode: 'insensitive',
          },
        },
      });

      if (displayBook) {
        // Link the user book to the DisplayBook
        await prisma.book.update({
          where: { id: userBook.id },
          data: { bookId: displayBook.id },
        });
        linkedCount++;
      } else {
        notFoundCount++;
        console.log(
          `⚠️  No match found for: "${userBook.title}" by ${userBook.author}`,
        );
      }
    } catch (error) {
      console.error(`Error processing book ${userBook.id}:`, error);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log(`Linked: ${linkedCount}`);
  console.log(`Not found: ${notFoundCount}`);
}

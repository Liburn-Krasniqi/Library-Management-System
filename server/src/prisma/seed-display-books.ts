import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const databaseUrl = configService.get<string>('DATABASE_URL');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

interface CSVRow {
  'Unnamed: 0': string;
  Book: string;
  Author: string;
  Description: string;
  Genres: string;
  Avg_Rating: string;
  Num_Ratings: string;
  URL: string;
}

async function main() {
  console.log('Starting to seed DisplayBooks...');

  const csvPath = path.join(process.cwd(), 'goodreads_data.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`);
  }

  const books: any[] = [];
  let processedCount = 0;

  // Read CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        const datasetIndex = parseInt(row['Unnamed: 0']);
        const avgRating = parseFloat(row['Avg_Rating']);

        books.push({
          title: row['Book'],
          author: row['Author'],
          description: row['Description'] || null,
          genres: row['Genres'] || null,
          avgRating: isNaN(avgRating) ? null : avgRating,
          datasetIndex: isNaN(datasetIndex) ? null : datasetIndex,
        });
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });

  console.log(`Found ${books.length} books in CSV`);

  // Insert books in batches to avoid overwhelming the database
  const batchSize = 100;
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);

    try {
      // Use createMany for better performance
      await prisma.displayBook.createMany({
        data: batch,
        skipDuplicates: true, // Skip if datasetIndex already exists
      });

      processedCount += batch.length;
      console.log(`Processed ${processedCount}/${books.length} books`);
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error);
      // Continue with next batch even if one fails
    }
  }

  console.log(
    `✅ Successfully seeded ${processedCount} books to DisplayBook table`,
  );

  // Print some statistics
  const totalBooks = await prisma.displayBook.count();
  const booksWithRatings = await prisma.displayBook.count({
    where: { avgRating: { not: null } },
  });
  const booksWithDatasetIndex = await prisma.displayBook.count({
    where: { datasetIndex: { not: null } },
  });

  console.log('\n📊 Statistics:');
  console.log(`Total books in database: ${totalBooks}`);
  console.log(`Books with ratings: ${booksWithRatings}`);
  console.log(`Books with dataset index: ${booksWithDatasetIndex}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

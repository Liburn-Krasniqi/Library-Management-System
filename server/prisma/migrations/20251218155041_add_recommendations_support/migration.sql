-- AlterTable
ALTER TABLE "books" ADD COLUMN     "bookId" INTEGER;

-- CreateTable
CREATE TABLE "DisplayBook" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "genres" TEXT,
    "avgRating" DOUBLE PRECISION,
    "coverImage" TEXT,
    "datasetIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisplayBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DisplayBook_datasetIndex_key" ON "DisplayBook"("datasetIndex");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "DisplayBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

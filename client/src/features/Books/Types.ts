export type ReadingStatus = "READING" | "COMPLETED" | "ON_HOLD";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string | null;
  readingStatus: ReadingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormState {
  id?: string;
  title: string;
  author: string;
  genre?: string;
  readingStatus: ReadingStatus;
}

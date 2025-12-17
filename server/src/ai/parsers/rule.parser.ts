export function parseQuestion(question: string) {
  const q = question.toLowerCase();

  if (q.includes('most books') && q.includes('who')) {
    return { type: 'MOST_BOOKS_OWNER' };
  }

  if (q.includes('most popular book')) {
    return { type: 'MOST_POPULAR_BOOK' };
  }

  if (q.includes('expensive')) {
    const match = q.match(/\d+/);
    return {
      type: 'TOP_EXPENSIVE_BOOKS',
      limit: match ? Number(match[0]) : 5,
    };
  }

  return { type: 'UNKNOWN' };
}

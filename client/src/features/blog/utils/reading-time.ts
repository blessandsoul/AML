export function calculateReadingTime(content: string): number {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');

  // Count words
  const words = text.trim().split(/\s+/).length;

  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);

  return minutes;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'მეტი ერთ წუთზე';
  return `${minutes} წთ წაკითხვა`;
}

export function highlight(text: string, query: string): string {
  if (!query.trim()) return text;

  // Escape special regex characters in query string
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
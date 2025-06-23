export function highlight(text: string, queries: string[]): string {
  // Filter out empty or whitespace-only queries
  const filtered = queries.map(q => q.trim()).filter(Boolean);
  if (filtered.length === 0) return text;

  // Escape each query string for regex safety
  const escaped = filtered.map(q =>
    q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // Join all queries into a single regex pattern
  const pattern = `(${escaped.join('|')})`;

  const regex = new RegExp(pattern, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
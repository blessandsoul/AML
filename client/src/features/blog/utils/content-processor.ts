export interface TOCItem {
  id: string;
  title: string;
  level: number; // 2 for h2, 3 for h3
}

export function extractTableOfContents(htmlContent: string): TOCItem[] {
  if (typeof window === 'undefined') return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');

  return Array.from(headings).map((heading, index) => {
    const title = heading.textContent || '';
    const level = parseInt(heading.tagName[1]);
    const id = generateHeadingId(title, index);

    return { id, title, level };
  });
}

export function processContentWithHeadingIds(htmlContent: string): string {
  if (typeof window === 'undefined') return htmlContent;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');

  headings.forEach((heading, index) => {
    const title = heading.textContent || '';
    const id = generateHeadingId(title, index);
    heading.setAttribute('id', id);
  });

  return doc.body.innerHTML;
}

function generateHeadingId(title: string, index: number): string {
  // Convert to slug-friendly ID
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  return `heading-${index}-${slug}`;
}

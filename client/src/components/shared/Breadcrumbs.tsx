'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = 'https://automarket.ge';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                )}
                {isLast ? (
                  <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

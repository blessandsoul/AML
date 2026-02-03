import { MetadataRoute } from 'next';

const BASE_URL = 'https://automarket.ge';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/catalog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/calculator`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/reviews`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/track`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Dynamic: Blog posts
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const response = await fetch(`${API_URL}/api/v1/blog?limit=1000`, {
            next: { revalidate: 3600 },
        });
        const data = await response.json();
        if (data.success && data.data?.items) {
            blogRoutes = data.data.items.map((post: { slug: string; updated_at: string }) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));
        }
    } catch {
        // Fail silently — static routes still work
    }

    return [...staticRoutes, ...blogRoutes];
}

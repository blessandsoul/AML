import type { BlogPost, BlogCategory, BlogTag } from '../types';

export const MOCK_CATEGORIES: BlogCategory[] = [
  { id: '1', name: 'აუქციონები', slug: 'auctions', description: 'ინფორმაცია აუქციონების შესახებ', color: '#2D88C4', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', _count: { posts: 3 } },
  { id: '2', name: 'რჩევები', slug: 'tips', description: 'სასარგებლო რჩევები მყიდველებისთვის', color: '#10B981', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', _count: { posts: 3 } },
  { id: '3', name: 'სიახლეები', slug: 'news', description: 'კომპანიის სიახლეები', color: '#F59E0B', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', _count: { posts: 1 } },
  { id: '4', name: 'მიმოხილვები', slug: 'reviews', description: 'ავტომობილების მიმოხილვები', color: '#8B5CF6', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', _count: { posts: 2 } },
];

const MOCK_TAGS: BlogTag[] = [
  { id: '1', name: 'Copart', slug: 'copart', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'USA', slug: 'usa', createdAt: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'IAAI', slug: 'iaai', createdAt: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'მიწოდება', slug: 'delivery', createdAt: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Manheim', slug: 'manheim', createdAt: '2024-01-01T00:00:00Z' },
];

function createPostTags(tagIds: string[]): BlogTag[] {
  return tagIds.map((tagId) => MOCK_TAGS.find((t) => t.id === tagId)!);
}

export const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'როგორ ვიყიდოთ მანქანა Copart აუქციონზე - სრული გზამკვლევი',
    slug: 'how-to-buy-car-on-copart-auction-guide',
    content: '<h2>რა არის Copart?</h2><p>Copart არის მსოფლიოში ერთ-ერთი უდიდესი ონლაინ აუქციონი...</p>',
    excerpt: 'დეტალური ინსტრუქცია, თუ როგორ უნდა დარეგისტრირდეთ და იყიდოთ ავტომობილი Copart აუქციონზე. რჩევები დამწყებთათვის.',
    featuredImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'გიორგი მამუკელაშვილი', avatar: null },
    publishedAt: '2024-01-15T10:00:00Z',
    viewCount: 1542,
    categoryId: '1',
    category: MOCK_CATEGORIES[0],
    tags: createPostTags(['1', '2']),
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'IAAI vs Copart - რომელი აუქციონი აირჩიოთ?',
    slug: 'iaai-vs-copart-which-auction-to-choose',
    content: '<h2>შედარებითი ანალიზი</h2><p>ორივე აუქციონი წარმოადგენს ამერიკის უმსხვილეს სადაზღვევო აუქციონებს...</p>',
    excerpt: 'სრული შედარება ორ უდიდეს ამერიკულ აუქციონს შორის. გაიგეთ რომელი უფრო შეესაბამება თქვენს საჭიროებებს.',
    featuredImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'დავით ბერიძე', avatar: null },
    publishedAt: '2024-01-20T14:30:00Z',
    viewCount: 2341,
    categoryId: '1',
    category: MOCK_CATEGORIES[0],
    tags: createPostTags(['1', '3']),
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'ტოპ 10 რჩევა აუქციონიდან მანქანის ყიდვისას',
    slug: 'top-10-tips-buying-car-from-auction',
    content: '<h2>1. ყოველთვის შეამოწმეთ VIN ნომერი</h2><p>VIN ნომრის შემოწმება გამოავლენს მანქანის რეალურ ისტორიას...</p>',
    excerpt: '10 მნიშვნელოვანი რჩევა, რომელიც დაგეხმარებათ თავიდან აიცილოთ შეცდომები და შეიძინოთ საუკეთესო ავტომობილი.',
    featuredImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'ნიკა ჯანელიძე', avatar: null },
    publishedAt: '2024-02-01T09:00:00Z',
    viewCount: 3876,
    categoryId: '2',
    category: MOCK_CATEGORIES[1],
    tags: createPostTags(['1', '3']),
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: '4',
    title: 'ახალი სერვისი: პრემიუმ ტრანსპორტირება ევროპიდან',
    slug: 'new-service-premium-shipping-from-europe',
    content: '<h2>გაფართოებული სერვისი</h2><p>სიამოვნებით გაცნობებთ, რომ Auto Market Logistic იწყებს პრემიუმ ავტომობილების ტრანსპორტირებას ევროპიდან...</p>',
    excerpt: 'Auto Market Logistic იწყებს ევროპიდან პრემიუმ ავტომობილების ტრანსპორტირებას. გაიგეთ მეტი ახალი სერვისის შესახებ.',
    featuredImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'Auto Market Logistic', avatar: null },
    publishedAt: '2024-02-10T11:00:00Z',
    viewCount: 1123,
    categoryId: '3',
    category: MOCK_CATEGORIES[2],
    tags: createPostTags(['4']),
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    id: '5',
    title: 'Toyota Camry 2020-2024 - დეტალური მიმოხილვა მყიდველისთვის',
    slug: 'toyota-camry-2020-2024-detailed-review',
    content: '<h2>რატომ Camry?</h2><p>Toyota Camry უკვე ათწლეულებია ლიდერობს საშუალო კლასის სედანების სეგმენტში...</p>',
    excerpt: 'სრული მიმოხილვა Toyota Camry-ის უახლესი თაობის შესახებ. ძრავები, კომპლექტაციები, ფასები აუქციონზე.',
    featuredImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'ლევან კვარაცხელია', avatar: null },
    publishedAt: '2024-02-15T16:00:00Z',
    viewCount: 2567,
    categoryId: '4',
    category: MOCK_CATEGORIES[3],
    tags: createPostTags(['1']),
    createdAt: '2024-02-15T16:00:00Z',
    updatedAt: '2024-02-15T16:00:00Z',
  },
  {
    id: '6',
    title: 'განბაჟების კალკულატორი - როგორ გამოვთვალოთ ხარჯები',
    slug: 'customs-calculator-how-to-calculate-costs',
    content: '<h2>განბაჟების ფორმულა</h2><p>საქართველოში ავტომობილის განბაჟება შედგება რამდენიმე კომპონენტისგან...</p>',
    excerpt: 'დეტალური ახსნა, თუ როგორ გამოითვლება ავტომობილის განბაჟების ხარჯები საქართველოში.',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'თამარ გელაშვილი', avatar: null },
    publishedAt: '2024-02-20T08:30:00Z',
    viewCount: 4521,
    categoryId: '2',
    category: MOCK_CATEGORIES[1],
    tags: createPostTags(['4']),
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2024-02-20T08:30:00Z',
  },
  {
    id: '7',
    title: 'BMW X5 (G05) - ღირს თუ არა ყიდვა აუქციონიდან?',
    slug: 'bmw-x5-g05-worth-buying-from-auction',
    content: '<h2>BMW X5 G05 - მიმოხილვა</h2><p>მეოთხე თაობის X5 (G05) BMW-ის ერთ-ერთი ყველაზე წარმატებული მოდელია...</p>',
    excerpt: 'ობიექტური ანალიზი BMW X5 G05-ის შეძენის რისკებისა და უპირატესობების შესახებ.',
    featuredImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'გიორგი მამუკელაშვილი', avatar: null },
    publishedAt: '2024-02-25T13:00:00Z',
    viewCount: 1876,
    categoryId: '4',
    category: MOCK_CATEGORIES[3],
    tags: createPostTags(['1', '3']),
    createdAt: '2024-02-25T13:00:00Z',
    updatedAt: '2024-02-25T13:00:00Z',
  },
  {
    id: '8',
    title: 'Manheim აუქციონი - დილერებისთვის საუკეთესო არჩევანი',
    slug: 'manheim-auction-best-choice-for-dealers',
    content: '<h2>რა არის Manheim?</h2><p>Manheim არის მსოფლიოში უდიდესი B2B ავტო აუქციონი...</p>',
    excerpt: 'გაიგეთ Manheim აუქციონის უპირატესობები და როგორ მიიღოთ წვდომა ექსკლუზიურ შეთავაზებებზე.',
    featuredImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'დავით ბერიძე', avatar: null },
    publishedAt: '2024-03-01T10:00:00Z',
    viewCount: 987,
    categoryId: '1',
    category: MOCK_CATEGORIES[0],
    tags: createPostTags(['5', '2']),
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '9',
    title: 'ელექტრომობილები აუქციონზე - 2024 წლის ტრენდები',
    slug: 'electric-vehicles-auction-2024-trends',
    content: '<h2>ელექტრომობილების ბუმი</h2><p>2024 წელს ელექტრომობილების რაოდენობა აუქციონებზე მნიშვნელოვნად გაიზარდა...</p>',
    excerpt: 'მიმოხილვა ელექტრომობილების ბაზრის შესახებ აუქციონებზე. Tesla, Rivian და სხვა ბრენდების ფასები და ტენდენციები.',
    featuredImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    status: 'PUBLISHED',
    author: { name: 'ნიკა ჯანელიძე', avatar: null },
    publishedAt: '2024-03-05T15:30:00Z',
    viewCount: 2134,
    categoryId: '2',
    category: MOCK_CATEGORIES[1],
    tags: createPostTags(['1', '3']),
    createdAt: '2024-03-05T15:30:00Z',
    updatedAt: '2024-03-05T15:30:00Z',
  },
];

// Helper to filter and paginate mock data
export function getMockPosts(params: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}) {
  const { page = 1, limit = 9, categoryId, search } = params;

  let filtered = [...MOCK_POSTS];

  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.excerpt?.toLowerCase().includes(s)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function getMockPostBySlug(slug: string): BlogPost | undefined {
  return MOCK_POSTS.find((p) => p.slug === slug);
}

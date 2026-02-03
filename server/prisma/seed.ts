import { PrismaClient, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'auctions' },
      update: {},
      create: {
        name: 'აუქციონები',
        slug: 'auctions',
        description: 'ინფორმაცია აუქციონების შესახებ',
        color: '#3B82F6',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'tips' },
      update: {},
      create: {
        name: 'რჩევები',
        slug: 'tips',
        description: 'სასარგებლო რჩევები მყიდველებისთვის',
        color: '#10B981',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'სიახლეები',
        slug: 'news',
        description: 'კომპანიის სიახლეები',
        color: '#F59E0B',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'reviews' },
      update: {},
      create: {
        name: 'მიმოხილვები',
        slug: 'reviews',
        description: 'ავტომობილების მიმოხილვები',
        color: '#8B5CF6',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create tags
  const tags = await Promise.all([
    prisma.blogTag.upsert({
      where: { slug: 'copart' },
      update: {},
      create: { name: 'Copart', slug: 'copart' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'iaai' },
      update: {},
      create: { name: 'IAAI', slug: 'iaai' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'manheim' },
      update: {},
      create: { name: 'Manheim', slug: 'manheim' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'usa' },
      update: {},
      create: { name: 'USA', slug: 'usa' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'delivery' },
      update: {},
      create: { name: 'მიწოდება', slug: 'delivery' },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Blog posts with real images
  const posts = [
    {
      title: 'როგორ ვიყიდოთ მანქანა Copart აუქციონზე - სრული გზამკვლევი',
      slug: 'how-to-buy-car-on-copart-auction-guide',
      content: `
<h2>რა არის Copart?</h2>
<p>Copart არის მსოფლიოში ერთ-ერთი უდიდესი ონლაინ აუქციონი, სადაც ყოველდღიურად ათასობით ავტომობილი იყიდება. კომპანია დაარსდა 1982 წელს და დღეს მას 200-ზე მეტი ლოკაცია აქვს მთელ მსოფლიოში.</p>

<h2>რეგისტრაცია და ვერიფიკაცია</h2>
<p>პირველი ნაბიჯი არის რეგისტრაცია Copart-ის ვებსაიტზე. თქვენ დაგჭირდებათ:</p>
<ul>
<li>პირადობის მოწმობის ან პასპორტის ასლი</li>
<li>მისამართის დამადასტურებელი დოკუმენტი</li>
<li>საბანკო ბარათი დეპოზიტისთვის</li>
</ul>

<h2>მანქანის შერჩევა</h2>
<p>Copart გთავაზობთ ფართო ასორტიმენტს - დაზიანებული ავტომობილებიდან თითქმის ახალ მანქანებამდე. ყურადღება მიაქციეთ:</p>
<ul>
<li><strong>Primary Damage</strong> - ძირითადი დაზიანება</li>
<li><strong>Secondary Damage</strong> - მეორადი დაზიანება</li>
<li><strong>Run & Drive</strong> - მოძრაობს თუ არა</li>
<li><strong>Keys</strong> - აქვს თუ არა გასაღები</li>
</ul>

<h2>ბიდინგის სტრატეგია</h2>
<p>წარმატებული შეძენისთვის გაითვალისწინეთ:</p>
<ol>
<li>დააწესეთ მაქსიმალური ბიუჯეტი და არ გადააჭარბოთ</li>
<li>გამოიყენეთ Proxy Bid ფუნქცია</li>
<li>გაითვალისწინეთ Buyer Fee და სხვა ხარჯები</li>
</ol>
      `,
      excerpt: 'დეტალური ინსტრუქცია, თუ როგორ უნდა დარეგისტრირდეთ და იყიდოთ ავტომობილი Copart აუქციონზე. რჩევები დამწყებთათვის.',
      featured_image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'გიორგი მამუკელაშვილი',
      category_slug: 'auctions',
      tag_slugs: ['copart', 'usa'],
      view_count: 1542,
    },
    {
      title: 'IAAI vs Copart - რომელი აუქციონი აირჩიოთ?',
      slug: 'iaai-vs-copart-which-auction-to-choose',
      content: `
<h2>შედარებითი ანალიზი</h2>
<p>ორივე აუქციონი წარმოადგენს ამერიკის უმსხვილეს სადაზღვევო აუქციონებს, მაგრამ მათ შორის არსებობს მნიშვნელოვანი განსხვავებები.</p>

<h2>Copart-ის უპირატესობები</h2>
<ul>
<li>უფრო დიდი ასორტიმენტი</li>
<li>მოსახერხებელი ინტერფეისი</li>
<li>Virtual Bidding სისტემა</li>
<li>მეტი ფოტო და ინფორმაცია</li>
</ul>

<h2>IAAI-ის უპირატესობები</h2>
<ul>
<li>ნაკლები კონკურენცია ზოგიერთ შტატში</li>
<li>საშუალოდ დაბალი ფასები</li>
<li>უფრო დეტალური მდგომარეობის აღწერა</li>
</ul>

<h2>ჩვენი რეკომენდაცია</h2>
<p>თუ პირველად ყიდულობთ, დაიწყეთ Copart-ით - მისი ინტერფეისი უფრო მოხერხებულია. შემდეგ სცადეთ IAAI-იც, შესაძლოა იქ უკეთესი შეთავაზებები იპოვოთ.</p>
      `,
      excerpt: 'სრული შედარება ორ უდიდეს ამერიკულ აუქციონს შორის. გაიგეთ რომელი უფრო შეესაბამება თქვენს საჭიროებებს.',
      featured_image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'დავით ბერიძე',
      category_slug: 'auctions',
      tag_slugs: ['copart', 'iaai', 'usa'],
      view_count: 2341,
    },
    {
      title: 'ტოპ 10 რჩევა აუქციონიდან მანქანის ყიდვისას',
      slug: 'top-10-tips-buying-car-from-auction',
      content: `
<h2>1. ყოველთვის შეამოწმეთ VIN ნომერი</h2>
<p>VIN ნომრის შემოწმება გამოავლენს მანქანის რეალურ ისტორიას - ავარიები, მფლობელების რაოდენობა, სერვისის ისტორია.</p>

<h2>2. გაითვალისწინეთ ყველა ხარჯი</h2>
<p>აუქციონის ფასი არ არის საბოლოო. დაამატეთ: Buyer Fee, ტრანსპორტირება, განბაჟება, რემონტი.</p>

<h2>3. ფოტოები ყურადღებით შეისწავლეთ</h2>
<p>დეტალურად დაათვალიერეთ ყველა ფოტო. ზოგჯერ მნიშვნელოვანი დაზიანებები მხოლოდ ერთ ფოტოზე ჩანს.</p>

<h2>4. იცოდეთ თქვენი ლიმიტი</h2>
<p>დააწესეთ მაქსიმალური თანხა და არასდროს გადააჭარბოთ. ემოციები ცუდი მრჩეველია.</p>

<h2>5. შეისწავლეთ მოდელის პრობლემები</h2>
<p>ყველა მოდელს აქვს ტიპიური პრობლემები. გაეცანით მათ წინასწარ.</p>
      `,
      excerpt: '10 მნიშვნელოვანი რჩევა, რომელიც დაგეხმარებათ თავიდან აიცილოთ შეცდომები და შეიძინოთ საუკეთესო ავტომობილი.',
      featured_image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'ნიკა ჯანელიძე',
      category_slug: 'tips',
      tag_slugs: ['copart', 'iaai'],
      view_count: 3876,
    },
    {
      title: 'ახალი სერვისი: პრემიუმ ტრანსპორტირება ევროპიდან',
      slug: 'new-service-premium-shipping-from-europe',
      content: `
<h2>გაფართოებული სერვისი</h2>
<p>სიამოვნებით გაცნობებთ, რომ Auto Market LGC იწყებს პრემიუმ ავტომობილების ტრანსპორტირებას ევროპიდან.</p>

<h2>რას მოიცავს სერვისი?</h2>
<ul>
<li>მანქანის შერჩევა და შემოწმება ადგილზე</li>
<li>დაზღვევა სრული ღირებულებით</li>
<li>კონტეინერით ან RoRo ტრანსპორტირება</li>
<li>განბაჟება და რეგისტრაცია</li>
</ul>

<h2>პირობები</h2>
<p>გერმანია, ნიდერლანდები, ბელგია - 2-3 კვირა. იტალია, საფრანგეთი - 3-4 კვირა.</p>
      `,
      excerpt: 'Auto Market LGC იწყებს ევროპიდან პრემიუმ ავტომობილების ტრანსპორტირებას. გაიგეთ მეტი ახალი სერვისის შესახებ.',
      featured_image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'Auto Market LGC',
      category_slug: 'news',
      tag_slugs: ['delivery'],
      view_count: 1123,
    },
    {
      title: 'Toyota Camry 2020-2024 - დეტალური მიმოხილვა მყიდველისთვის',
      slug: 'toyota-camry-2020-2024-detailed-review',
      content: `
<h2>რატომ Camry?</h2>
<p>Toyota Camry უკვე ათწლეულებია ლიდერობს საშუალო კლასის სედანების სეგმენტში. საიმედოობა, კომფორტი და ეკონომიურობა - ეს ის თვისებებია, რაც მას გამოარჩევს.</p>

<h2>ძრავის ვარიანტები</h2>
<ul>
<li><strong>2.5L 4-ცილინდრიანი</strong> - 203 ცხ.ძ., საუკეთესო ბალანსი</li>
<li><strong>3.5L V6</strong> - 301 ცხ.ძ., სპორტული დინამიკა</li>
<li><strong>ჰიბრიდი</strong> - 208 ცხ.ძ., საუკეთესო ეკონომია</li>
</ul>

<h2>კომპლექტაციები</h2>
<p>LE, SE, XLE, XSE, TRD - ყველა კომპლექტაცია გთავაზობთ Toyota Safety Sense 2.5+ სისტემას სტანდარტულად.</p>

<h2>ფასები აუქციონზე</h2>
<p>2020-2024 წლის მოდელები საშუალოდ $15,000-$28,000 ფასად იყიდება მდგომარეობიდან გამომდინარე.</p>
      `,
      excerpt: 'სრული მიმოხილვა Toyota Camry-ის უახლესი თაობის შესახებ. ძრავები, კომპლექტაციები, ფასები აუქციონზე.',
      featured_image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'ლევან კვარაცხელია',
      category_slug: 'reviews',
      tag_slugs: ['copart', 'iaai'],
      view_count: 2567,
    },
    {
      title: 'განბაჟების კალკულატორი - როგორ გამოვთვალოთ ხარჯები',
      slug: 'customs-calculator-how-to-calculate-costs',
      content: `
<h2>განბაჟების ფორმულა</h2>
<p>საქართველოში ავტომობილის განბაჟება შედგება რამდენიმე კომპონენტისგან.</p>

<h2>ძირითადი გადასახადები</h2>
<ul>
<li><strong>აქციზი</strong> - ძრავის მოცულობაზე დამოკიდებული</li>
<li><strong>დღგ</strong> - 18% (საანგარიშო ბაზიდან)</li>
<li><strong>იმპორტის გადასახადი</strong> - 5%</li>
</ul>

<h2>აქციზის განაკვეთები</h2>
<table>
<tr><td>0-1500 სმ³</td><td>0.50 ლარი/სმ³</td></tr>
<tr><td>1501-2000 სმ³</td><td>0.80 ლარი/სმ³</td></tr>
<tr><td>2001-3000 სმ³</td><td>1.50 ლარი/სმ³</td></tr>
<tr><td>3001+ სმ³</td><td>2.50 ლარი/სმ³</td></tr>
</table>

<h2>გამოიყენეთ ჩვენი კალკულატორი</h2>
<p>ჩვენს ვებსაიტზე შეგიძლიათ გამოიყენოთ კალკულატორი და მიიღოთ ზუსტი გათვლა.</p>
      `,
      excerpt: 'დეტალური ახსნა, თუ როგორ გამოითვლება ავტომობილის განბაჟების ხარჯები საქართველოში.',
      featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'თამარ გელაშვილი',
      category_slug: 'tips',
      tag_slugs: ['delivery'],
      view_count: 4521,
    },
    {
      title: 'BMW X5 (G05) - ღირს თუ არა ყიდვა აუქციონიდან?',
      slug: 'bmw-x5-g05-worth-buying-from-auction',
      content: `
<h2>BMW X5 G05 - მიმოხილვა</h2>
<p>მეოთხე თაობის X5 (G05) BMW-ის ერთ-ერთი ყველაზე წარმატებული მოდელია. მაგრამ ღირს თუ არა მისი ყიდვა აუქციონიდან?</p>

<h2>რისკები</h2>
<ul>
<li>რთული ელექტრონიკა - დაზიანებისას ძვირი რემონტი</li>
<li>პნევმო საკიდარი - შეცვლის ღირებულება მაღალია</li>
<li>დიზელის მოდელებზე AdBlue სისტემის პრობლემები</li>
</ul>

<h2>უპირატესობები</h2>
<ul>
<li>პრემიუმ ხარისხი ხელმისაწვდომ ფასად</li>
<li>მძლავრი ძრავები და დინამიკა</li>
<li>ფართო სალონი და ბარგის განყოფილება</li>
</ul>

<h2>ჩვენი ვერდიქტი</h2>
<p>თუ მექანიკურად გამართულია და მხოლოდ კოსმეტიკური დაზიანება აქვს - ღირს. სტრუქტურული ან წყლით დაზიანებული - არ ღირს.</p>
      `,
      excerpt: 'ობიექტური ანალიზი BMW X5 G05-ის შეძენის რისკებისა და უპირატესობების შესახებ.',
      featured_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'გიორგი მამუკელაშვილი',
      category_slug: 'reviews',
      tag_slugs: ['copart', 'iaai'],
      view_count: 1876,
    },
    {
      title: 'Manheim აუქციონი - დილერებისთვის საუკეთესო არჩევანი',
      slug: 'manheim-auction-best-choice-for-dealers',
      content: `
<h2>რა არის Manheim?</h2>
<p>Manheim არის მსოფლიოში უდიდესი B2B ავტო აუქციონი. განსხვავებით Copart-ისა და IAAI-სგან, აქ ძირითადად დილერები ყიდულობენ.</p>

<h2>უპირატესობები</h2>
<ul>
<li>უკეთესი მდგომარეობის მანქანები</li>
<li>ნაკლები დაზიანებული ავტომობილი</li>
<li>Off-lease და trade-in მანქანები</li>
<li>სრული სერვისის ისტორია</li>
</ul>

<h2>როგორ მივიღოთ წვდომა?</h2>
<p>Manheim-ზე დასარეგისტრირებლად საჭიროა დილერის ლიცენზია. ჩვენ გთავაზობთ წვდომას ჩვენი ანგარიშით.</p>
      `,
      excerpt: 'გაიგეთ Manheim აუქციონის უპირატესობები და როგორ მიიღოთ წვდომა ექსკლუზიურ შეთავაზებებზე.',
      featured_image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'დავით ბერიძე',
      category_slug: 'auctions',
      tag_slugs: ['manheim', 'usa'],
      view_count: 987,
    },
    {
      title: 'ელექტრომობილები აუქციონზე - 2024 წლის ტრენდები',
      slug: 'electric-vehicles-auction-2024-trends',
      content: `
<h2>ელექტრომობილების ბუმი</h2>
<p>2024 წელს ელექტრომობილების რაოდენობა აუქციონებზე მნიშვნელოვნად გაიზარდა. Tesla, Rivian, Ford Mustang Mach-E - ყველა ხელმისაწვდომია.</p>

<h2>რაზე უნდა მიაქციოთ ყურადღება</h2>
<ul>
<li><strong>ბატარეის მდგომარეობა</strong> - SOH (State of Health) მაჩვენებელი</li>
<li><strong>წყლით დაზიანება</strong> - განსაკუთრებით საშიშია EV-სთვის</li>
<li><strong>გარანტია</strong> - შემოწმეთ გადაცემადია თუ არა</li>
</ul>

<h2>ფასების ტენდენცია</h2>
<p>Tesla Model 3/Y ფასები 20-30%-ით დაეცა წინა წელთან შედარებით, რაც შესანიშნავი შესაძლებლობაა მყიდველებისთვის.</p>
      `,
      excerpt: 'მიმოხილვა ელექტრომობილების ბაზრის შესახებ აუქციონებზე. Tesla, Rivian და სხვა ბრენდების ფასები და ტენდენციები.',
      featured_image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      status: PostStatus.PUBLISHED,
      author_name: 'ნიკა ჯანელიძე',
      category_slug: 'tips',
      tag_slugs: ['copart', 'iaai'],
      view_count: 2134,
    },
  ];

  for (const postData of posts) {
    const category = categories.find(
      (c) => c.slug === postData.category_slug
    );

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: postData.slug },
    });

    if (!existingPost) {
      const post = await prisma.blogPost.create({
        data: {
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          featured_image: postData.featured_image,
          status: postData.status,
          author_name: postData.author_name,
          category_id: category?.id,
          view_count: postData.view_count,
          published_at: new Date(),
        },
      });

      // Add tags
      const postTags = tags.filter((t) =>
        postData.tag_slugs.includes(t.slug)
      );

      for (const tag of postTags) {
        await prisma.blogPostTag.create({
          data: {
            post_id: post.id,
            tag_id: tag.id,
          },
        });
      }

      console.log(`📝 Created post: ${post.title}`);
    } else {
      console.log(`⏭️ Skipped (exists): ${postData.title}`);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

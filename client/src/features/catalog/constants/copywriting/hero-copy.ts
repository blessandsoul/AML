/**
 * Hero Section Copywriting
 *
 * Centralized content for the main hero section to enable easy updates,
 * A/B testing, and future internationalization.
 */

export const HERO_COPY = {
  // Main title - gradient part
  mainTitle: "ავტომობილები Copart და IAAI-დან",
  mainTitleAlt: "პირდაპირი წვდომა Copart-სა და IAAI-ზე",

  // Subtitle - white part
  subtitle: "გარანტიით",

  // Description - benefits statement
  description: "დაზოგეთ ბაზრის ფასის 40%-მდე. ავტომობილის ისტორიის სრული შემოწმება Carfax-ით.",

  // Partnership badge
  partnershipBadge: {
    text: "ოფიციალური ბროკერი",
    subtext: "Copart • IAAI • Manheim • Adesa",
  },

  // Phone number
  phone: {
    display: "0 32 2 054 244",
    tel: "0322054244",
  },

  // CTA buttons
  cta: {
    primary: "უფასო კონსულტაცია",
    secondary: "ღირებულების დათვლა",
  },
} as const;

/**
 * Alternative hero copy variations for A/B testing
 */
export const HERO_COPY_VARIANTS = {
  variant1: {
    mainTitle: "პირდაპირი წვდომა",
    subtitle: "ამერიკის აუქციონებზე",
    description: "დაზოგე 30%-მდე შუამავლების გარეშე. სადილერო პირობები Copart, IAAI, Manheim და Adesa-ზე.",
  },
  variant2: {
    mainTitle: "ავტომობილები ამერიკიდან",
    subtitle: "გარანტიით და Carfax-ით",
    description: "წვდომა Copart, IAAI, Manheim, Adesa აუქციონებზე. დაზოგეთ ბაზრის ფასის 40%-მდე.",
  },
} as const;

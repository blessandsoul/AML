/**
 * Company Statistics & Social Proof
 *
 * Statistics used throughout the site to build trust and credibility.
 * These are placeholder values that should be updated with actual data.
 */

export interface CompanyStat {
  value: string;
  label: string;
  description?: string;
}

/**
 * Main company statistics for social proof
 */
export const COMPANY_STATS: CompanyStat[] = [
  {
    value: "50000+",
    label: "წარმატებული იმპორტი",
    description: "Successful car imports from US auctions",
  },
  {
    value: "98%",
    label: "კმაყოფილი კლიენტები",
    description: "Customer satisfaction rate",
  },
  {
    value: "35%",
    label: "საშუალო დანაზოგი",
    description: "Average savings compared to local market",
  },
] as const;

/**
 * Additional statistics for different contexts
 */
export const EXTENDED_STATS = {
  yearsInBusiness: {
    value: "5+",
    label: "წელი ბაზარზე",
  },
  avgDeliveryTime: {
    value: "45-60",
    label: "დღე მიწოდებამდე",
  },
  carfaxChecks: {
    value: "100%",
    label: "Carfax შემოწმება",
  },
} as const;

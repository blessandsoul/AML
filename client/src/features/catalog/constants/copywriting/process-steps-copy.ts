/**
 * Process Steps Copywriting
 *
 * Action-oriented process steps that emphasize outcomes and reduce user anxiety.
 * Uses verb + outcome format instead of noun-based titles.
 */

import { MousePointerClick, Gavel, Ship, LucideIcon } from 'lucide-react';

export interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: MousePointerClick,
    title: "აირჩიე მანქანა",
    description: "ჩვენ დაგეხმარებით პროფესიონალურ ინსპექტირებასა და ისტორიის შემოწმებაში",
  },
  {
    icon: Gavel,
    title: "მოიგე აუქციონზე",
    description: "ჩვენი ბროკერები უზრუნველყოფენ ოპტიმალურ ფსონს",
  },
  {
    icon: Ship,
    title: "თვალი ადევნე გზას",
    description: "უსაფრთხო ტრანსპორტირება. ფოთი 45-60 დღეში",
  },
] as const;

/**
 * Section headings for the process steps
 */
export const PROCESS_STEPS_HEADING = {
  main: "მარტივი გზა",
  highlight: "თქვენს საოცნებო მანქანამდე",
} as const;

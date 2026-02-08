import { Gavel, Package, Truck } from 'lucide-react';
import { FlagGE, FlagUS, FlagRU, FlagUA, FlagSA } from '@/components/ui/flags';

export const NAV_ITEMS = [
    { label: 'მთავარი', href: '/' },
    { label: 'მთვლელი', href: '/calculator' },
    { label: 'ავტომობილები', href: '/catalog' },
    { label: 'ტეხასი', href: '/texas' },
    { label: 'ჩვენს შესახებ', href: '/about' },
    { label: 'კონტაქტი', href: '/contact' },
];

export const MORE_ITEMS = [
    { label: 'აუქციონები', href: '/auctions', icon: Gavel },
    { label: 'თრექინგი', href: '/track', icon: Package },
    { label: 'ტრანსპორტირება', href: '/delivery', icon: Truck },
];

export const LANGUAGES = [
    { code: 'GE', label: 'ქართული', icon: FlagGE },
    { code: 'EN', label: 'English', icon: FlagUS },
    { code: 'UA', label: 'Українська', icon: FlagUA },
    { code: 'RU', label: 'Русский', icon: FlagRU },
    { code: 'AR', label: 'العربية', icon: FlagSA },
];

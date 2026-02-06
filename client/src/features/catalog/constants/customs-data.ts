import { FuelTypeRu } from '../types/customs.types';

// Fuel types in Russian
export const FUEL_TYPES_RU: readonly FuelTypeRu[] = ['Бензин', 'Дизель'] as const;

// Fuel types in Georgian
export const FUEL_TYPES_GE = ['ბენზინი', 'დიზელი'] as const;
export type FuelTypeGe = typeof FUEL_TYPES_GE[number];

// Vehicle age options (1-15 years)
export const VEHICLE_AGE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

// Ukraine customs age-based rates (EUR per cc)
export const UKRAINE_AGE_RATES = {
  '0-3': 50,
  '3-5': 100,
  '5-8': 150,
  '8+': 200,
} as const;

// Ukraine fuel type multipliers
export const UKRAINE_FUEL_MULTIPLIERS = {
  'Бензин': 1.0,
  'Дизель': 1.15,
} as const;

// Ukraine VAT rate
export const UKRAINE_VAT_RATE = 0.20; // 20%

// Georgia customs age-based rates (GEL per cc)
export const GEORGIA_AGE_RATES = {
  '0-3': 0.20,
  '3-7': 0.50,
  '7+': 1.00,
} as const;

// Currency conversion rates
export const EUR_TO_USD = 1.1;
export const USD_TO_GEL = 2.7;

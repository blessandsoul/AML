import {
  UKRAINE_AGE_RATES,
  UKRAINE_FUEL_MULTIPLIERS,
  UKRAINE_VAT_RATE,
  GEORGIA_AGE_RATES,
  EUR_TO_USD,
  USD_TO_GEL,
} from '../constants/customs-data';
import type {
  UkraineCustomsInput,
  GeorgiaCustomsInput,
  CustomsResult,
  FuelTypeRu,
} from '../types/customs.types';

/**
 * Get the age rate key for Ukraine based on vehicle age
 */
function getUkraineAgeRateKey(age: number): keyof typeof UKRAINE_AGE_RATES {
  if (age <= 3) return '0-3';
  if (age <= 5) return '3-5';
  if (age <= 8) return '5-8';
  return '8+';
}

/**
 * Get the age rate key for Georgia based on vehicle age
 */
function getGeorgiaAgeRateKey(age: number): keyof typeof GEORGIA_AGE_RATES {
  if (age <= 3) return '0-3';
  if (age <= 7) return '3-7';
  return '7+';
}

/**
 * Calculate customs duty for importing a car to Ukraine
 *
 * Formula:
 * - Convert engine capacity from liters to cc (× 1000)
 * - Base duty = (cc × age_rate × fuel_multiplier) in EUR
 * - Convert base duty to USD
 * - Calculate excise duty based on engine size
 * - Calculate VAT = 20% of (price + base_duty + excise)
 * - Total = base_duty + excise + VAT
 */
export function calculateUkraineCustoms(input: UkraineCustomsInput): CustomsResult {
  const { price, engineCapacity, fuelType, age } = input;

  // Validate inputs
  if (price <= 0 || engineCapacity <= 0 || age <= 0) {
    return { total: 0 };
  }

  // Convert engine capacity from liters to cc
  const engineCC = engineCapacity * 1000;

  // Get age-based rate
  const ageRateKey = getUkraineAgeRateKey(age);
  const ageRate = UKRAINE_AGE_RATES[ageRateKey];

  // Get fuel multiplier
  const fuelMultiplier = UKRAINE_FUEL_MULTIPLIERS[fuelType];

  // Calculate base duty in EUR
  const baseDutyEUR = engineCC * ageRate * fuelMultiplier;

  // Convert to USD
  const baseDutyUSD = Math.round(baseDutyEUR * EUR_TO_USD);

  // Calculate excise duty based on engine size
  // Excise rates (simplified):
  // < 3000cc: 50 EUR per 1000cc
  // >= 3000cc: 100 EUR per 1000cc
  const exciseRatePerLiter = engineCapacity < 3.0 ? 50 : 100;
  const exciseDutyEUR = engineCapacity * exciseRatePerLiter;
  const exciseDutyUSD = Math.round(exciseDutyEUR * EUR_TO_USD);

  // Calculate VAT (20% of price + duties)
  const taxableBase = price + baseDutyUSD + exciseDutyUSD;
  const vatUSD = Math.round(taxableBase * UKRAINE_VAT_RATE);

  // Total customs cost
  const total = baseDutyUSD + exciseDutyUSD + vatUSD;

  return {
    total,
    breakdown: {
      baseDuty: baseDutyUSD,
      excise: exciseDutyUSD,
      vat: vatUSD,
    },
  };
}

/**
 * Calculate customs duty for importing a car to Georgia
 *
 * Formula:
 * - Convert engine capacity from liters to cc (× 1000)
 * - Rate per cc depends on age bracket
 * - Total = cc × rate_per_cc (in GEL)
 */
export function calculateGeorgiaCustoms(input: GeorgiaCustomsInput): CustomsResult {
  const { engineCapacity, age } = input;

  // Validate inputs
  if (engineCapacity <= 0 || age <= 0) {
    return { total: 0 };
  }

  // Convert engine capacity from liters to cc
  const engineCC = engineCapacity * 1000;

  // Get age-based rate (in GEL per cc)
  const ageRateKey = getGeorgiaAgeRateKey(age);
  const ratePerCC = GEORGIA_AGE_RATES[ageRateKey];

  // Calculate total customs duty in GEL
  const totalGEL = Math.round(engineCC * ratePerCC);

  return {
    total: totalGEL,
  };
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

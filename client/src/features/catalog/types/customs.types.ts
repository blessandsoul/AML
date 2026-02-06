export interface UkraineCustomsInput {
  price: number;
  engineCapacity: number; // in liters
  fuelType: 'Бензин' | 'Дизель';
  age: number;
}

export interface GeorgiaCustomsInput {
  engineCapacity: number; // in liters
  age: number;
}

export interface CustomsResult {
  total: number;
  breakdown?: {
    baseDuty?: number;
    vat?: number;
    excise?: number;
  };
}

export type FuelTypeRu = 'Бензин' | 'Дизель';

import { REAL_CAR_PHOTOS } from './real-car-photos';

export interface Car {
    id: string;
    title: string;
    price: number;
    currency: 'USD' | 'EUR';
    image: string;
    images?: string[];
    mileage: number;
    year: number;
    fuel: string;
    engine: string;
    location: string;
    auction?: 'Copart' | 'IAAI' | 'Manheim' | 'ADESA';
    status?: 'active' | 'sold' | 'reserved';
    lotNumber?: string;
}

const BASE_CARS: Car[] = [
    {
        id: '1',
        title: '2023 BMW X5 M Competition',
        price: 45000,
        currency: 'USD',
        // Using first image as main, but also providing full gallery in images
        image: REAL_CAR_PHOTOS["5744497592"][0],
        images: REAL_CAR_PHOTOS["5744497592"],
        mileage: 4500,
        year: 2023,
        fuel: 'ბენზინი',
        engine: '4.4ლ V8',
        location: 'ლოს-ანჯელესი, CA',
        auction: 'IAAI',
        status: 'active',
        lotNumber: '57444975'
    },
    {
        id: '2',
        title: '2022 Mercedes-AMG GT 63 S',
        price: 82000,
        currency: 'EUR',
        image: REAL_CAR_PHOTOS["5751385850"][0],
        images: REAL_CAR_PHOTOS["5751385850"],
        mileage: 12000,
        year: 2022,
        fuel: 'ჰიბრიდი',
        engine: '4.0ლ V8',
        location: 'ბერლინი, გერმანია',
        auction: 'IAAI',
        status: 'active',
        lotNumber: '57513858'
    },
    {
        id: '3',
        title: '2021 Porsche 911 Turbo S',
        price: 115000,
        currency: 'USD',
        image: REAL_CAR_PHOTOS["5748691586"][0],
        images: REAL_CAR_PHOTOS["5748691586"],
        mileage: 8500,
        year: 2021,
        fuel: 'ბენზინი',
        engine: '3.8ლ Flat-6',
        location: 'მაიამი, FL',
        auction: 'IAAI',
        status: 'reserved',
        lotNumber: '57486915'
    },
    {
        id: '4',
        title: '2022 Audi RS Q8',
        price: 108000,
        currency: 'EUR',
        image: REAL_CAR_PHOTOS["57388033352123"][0],
        images: REAL_CAR_PHOTOS["57388033352123"],
        mileage: 5600,
        year: 2022,
        fuel: 'ბენზინი',
        engine: '4.0ლ V8',
        location: 'მიუნხენი, გერმანია',
        auction: 'IAAI',
        status: 'active',
        lotNumber: '57388033'
    },
    {
        id: '5',
        title: '2023 Range Rover Autobiography',
        price: 145000,
        currency: 'USD',
        image: REAL_CAR_PHOTOS["57388031102430"][0],
        images: REAL_CAR_PHOTOS["57388031102430"],
        mileage: 2100,
        year: 2023,
        fuel: 'ჰიბრიდი',
        engine: '4.4ლ V8',
        location: 'ნიუ-იორკი, NY',
        auction: 'IAAI',
        status: 'active',
        lotNumber: '57388031'
    }
];

export const MOCK_CARS: Car[] = [
    ...BASE_CARS,
    ...BASE_CARS.map(c => ({ ...c, id: c.id + '_dup', title: c.title + ' (Copy)' }))
];

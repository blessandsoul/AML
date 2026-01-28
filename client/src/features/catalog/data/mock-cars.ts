export interface Car {
    id: string;
    title: string;
    price: number;
    currency: 'USD' | 'EUR';
    image: string;
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
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ebcc9?q=80&w=2000&auto=format&fit=crop',
        mileage: 4500,
        year: 2023,
        fuel: 'Petrol',
        engine: '4.4L V8',
        location: 'Los Angeles, CA',
        auction: 'Manheim',
        status: 'active',
        lotNumber: '58923012'
    },
    {
        id: '2',
        title: '2022 Mercedes-AMG GT 63 S',
        price: 82000,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2000&auto=format&fit=crop',
        mileage: 12000,
        year: 2022,
        fuel: 'Hybrid',
        engine: '4.0L V8',
        location: 'Berlin, Germany',
        auction: 'ADESA',
        status: 'active',
        lotNumber: '99283741'
    },
    {
        id: '3',
        title: '2021 Porsche 911 Turbo S',
        price: 115000,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1611821064436-0909594bdab5?q=80&w=2000&auto=format&fit=crop',
        mileage: 8500,
        year: 2021,
        fuel: 'Petrol',
        engine: '3.8L Flat-6',
        location: 'Miami, FL',
        auction: 'Copart',
        status: 'reserved',
        lotNumber: '33492100'
    },
    {
        id: '4',
        title: '2022 Audi RS Q8',
        price: 108000,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=2000&auto=format&fit=crop',
        mileage: 5600,
        year: 2022,
        fuel: 'Petrol',
        engine: '4.0L V8',
        location: 'Munich, Germany',
        auction: 'Manheim',
        status: 'active',
        lotNumber: '77281902'
    },
    {
        id: '5',
        title: '2023 Range Rover Autobiography',
        price: 145000,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop',
        mileage: 2100,
        year: 2023,
        fuel: 'Hybrid',
        engine: '4.4L V8',
        location: 'New York, NY',
        auction: 'Copart',
        status: 'active',
        lotNumber: '11293847'
    }
];

export const MOCK_CARS: Car[] = [
    ...BASE_CARS,
    ...BASE_CARS.map(c => ({ ...c, id: c.id + '_dup', title: c.title + ' (Copy)' }))
];

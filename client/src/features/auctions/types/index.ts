export interface AuctionCar {
    id: string;
    title: string;
    year: number;
    image: string;
    currentBid: number;
    buyNowPrice?: number;
    currency: string;
    endTime: string; // ISO string
    bids: number;
    location: string;
    engine: string;
    mileage: number;
    transmission: string;
    driveType: string;
    fuelType: string;
    color: string;
    vin: string;
    lotNumber: string;
    seller: string;
    condition: 'Run & Drive' | 'Engine Start' | 'Enhanced Vehicles';
    status: 'live' | 'upcoming' | 'ended';
    auctionHouse: 'IAAI' | 'Copart' | 'Manheim' | 'Adesa';
}

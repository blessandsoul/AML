export interface CalcResult {
    lotPrice: number;
    auctionFee: number;
    usaDelivery: number;
    seaShipping: number;
    insurance: number;
    customsDuty: number;
    total: number;
    localMarketPrice: number;
    savings: number;
    dealerSellingPrice: number;
    dealerProfit: number;
}

export function compute(
    price: number, port: string, category: string, fuel: string, insured: string,
): CalcResult {
    const auctionFee = price <= 500 ? 25 : price <= 1000 ? 49 : price <= 2000 ? 75
        : price <= 4000 ? 110 : price <= 6000 ? 175 : price <= 8000 ? 225
        : price <= 10000 ? 300 : price <= 15000 ? 400 : price <= 20000 ? 500
        : Math.round(price * 0.03);

    const deliveryMap: Record<string, number> = {
        Sedan: 350, Bike: 200, 'Small SUV': 400,
        'Big SUV': 500, Pickup: 550, Van: 500, 'Big Van': 650,
    };
    const usaDelivery = deliveryMap[category] || 350;

    const shippingMap: Record<string, number> = {
        POTI: 1200, KLAIPEDA: 1400, ODESSA: 1350, 'Jebel Ali': 1800,
    };
    const seaShipping = shippingMap[port] || 1200;

    const insuranceCost = insured === 'Yes' ? Math.round(price * 0.02) : 0;

    const customsMap: Record<string, number> = {
        Gasoline: Math.round(price * 0.08),
        Hybrid: Math.round(price * 0.05),
        Electro: 0,
    };
    const customsDuty = customsMap[fuel] || Math.round(price * 0.08);

    const total = price + auctionFee + usaDelivery + seaShipping + insuranceCost + customsDuty;
    const localMarketPrice = Math.round(total * 1.38);
    const savings = localMarketPrice - total;
    const dealerSellingPrice = Math.round(total * 1.35);
    const dealerProfit = dealerSellingPrice - total;

    return {
        lotPrice: price, auctionFee, usaDelivery, seaShipping,
        insurance: insuranceCost, customsDuty, total,
        localMarketPrice, savings, dealerSellingPrice, dealerProfit,
    };
}

export function fmt(n: number): string {
    return n.toLocaleString('en-US');
}

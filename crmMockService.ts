import { DetailedSale, HeatmapPoint } from './types';

// Helper to generate random dates within the last 30 days
const getRandomDate = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const PRODUCTS_MOCK = [
    { name: 'Costela Defumada', category: 'Principal', price: 89.90 },
    { name: 'Burger Industrial', category: 'Principal', price: 42.00 },
    { name: 'Dadinhos de Tapioca', category: 'Entrada', price: 28.00 },
    { name: 'Soda Italiana', category: 'Bebida', price: 14.00 },
    { name: 'Cheesecake', category: 'Sobremesa', price: 22.00 },
];

const CUSTOMERS_MOCK = [
    { name: 'João Silva', phone: '11999998888', address: 'Rua das Flores, 123' },
    { name: 'Maria Santos', phone: '11988887777', address: 'Av. Paulista, 1000' },
    { name: 'Pedro Costa', phone: '11977776666', address: 'Rua Augusta, 500' },
    { name: 'Ana Pereira', phone: '11966665555', address: 'Rua Oscar Freire, 200' },
    { name: 'Carlos Oliveira', phone: '11955554444', address: 'Al. Lorena, 300' },
];

export const generateMockSales = (count: number = 50): DetailedSale[] => {
    return Array.from({ length: count }).map((_, i) => {
        const product = PRODUCTS_MOCK[Math.floor(Math.random() * PRODUCTS_MOCK.length)];
        const customer = CUSTOMERS_MOCK[Math.floor(Math.random() * CUSTOMERS_MOCK.length)];

        return {
            id: `ord-${i + 1}`,
            date: getRandomDate(),
            customerName: customer.name,
            whatsapp: customer.phone,
            category: product.category,
            product: product.name,
            price: product.price,
            address: customer.address,
        };
    });
};

export const generateHeatmapData = (): HeatmapPoint[] => {
    const data: HeatmapPoint[] = [];
    // Mocking 30 days of month, 24 hours
    for (let d = 1; d <= 30; d++) {
        for (let h = 0; h < 24; h++) {
            // Create a peak around 12h (lunch) and 20h (dinner)
            let baseIntensity = 0.1;
            if (h >= 11 && h <= 14) baseIntensity += 0.6;
            if (h >= 19 && h <= 22) baseIntensity += 0.7;

            // Random variation
            let intensity = Math.min(1, Math.max(0, baseIntensity + (Math.random() * 0.4 - 0.2)));

            data.push({
                dayIndex: d,
                hour: h,
                intensity
            });
        }
    }
    return data;
};

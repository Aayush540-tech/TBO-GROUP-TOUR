export interface Hotel {
    id: string;
    name: string;
    location: string;
    rating: number; // 1-5
    imageUrl: string;
    amenities: string[];
}

export interface RoomType {
    id: string;
    name: string;
    maxOccupancy: number;
}

export interface Rate {
    roomTypeId: string;
    basePrice: number;
    currency: string;
    availableQuantity: number;
}

// Mock Data
const MOCK_HOTELS: Hotel[] = [
    {
        id: "h_dubai_1",
        name: "Grand Hyatt Dubai",
        location: "Dubai Healthcare City, Dubai",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
        amenities: ["Pool", "Spa", "WiFi", "Gym"]
    },
    {
        id: "h_dubai_2",
        name: "Atlantis, The Palm",
        location: "Palm Jumeirah, Dubai",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
        amenities: ["Waterpark", "Beach", "Aquarium", "Fine Dining"]
    },
    {
        id: "h_mumbai_1",
        name: "The Taj Mahal Palace",
        location: "Colaba, Mumbai",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=800",
        amenities: ["Pool", "Heritage", "Sea View", "Butler Service"]
    },
    {
        id: "h_delhi_1",
        name: "The Leela Palace",
        location: "Chanakyapuri, New Delhi",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        amenities: ["Luxury", "Pool", "Spa", "Fine Dining"]
    },
    {
        id: "h_goa_1",
        name: "Taj Exotica Resort & Spa",
        location: "Benaulim, Goa",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
        amenities: ["Beach", "Golf", "Spa", "Villas"]
    }
];

const MOCK_ROOMS: RoomType[] = [
    { id: "rt_std", name: "Standard Room", maxOccupancy: 2 },
    { id: "rt_dlx", name: "Deluxe Room", maxOccupancy: 2 },
    { id: "rt_suite", name: "Junior Suite", maxOccupancy: 3 },
    { id: "rt_exec", name: "Executive Suite", maxOccupancy: 4 },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class TBOApiClient {
    private static instance: TBOApiClient;

    private constructor() { }

    public static getInstance(): TBOApiClient {
        if (!TBOApiClient.instance) {
            TBOApiClient.instance = new TBOApiClient();
        }
        return TBOApiClient.instance;
    }

    async searchHotels(query: string): Promise<Hotel[]> {
        await delay(500 + Math.random() * 500); // Simulate API latency
        const lowerQuery = query.toLowerCase();

        // Filter mock hotels
        return MOCK_HOTELS.filter(hotel =>
            hotel.name.toLowerCase().includes(lowerQuery) ||
            hotel.location.toLowerCase().includes(lowerQuery)
        );
    }

    async getHotelDetails(hotelId: string): Promise<Hotel | undefined> {
        await delay(300);
        return MOCK_HOTELS.find(h => h.id === hotelId);
    }

    async getRoomRates(hotelId: string, _checkIn: Date, _checkOut: Date): Promise<Rate[]> {
        await delay(600);
        // Simulate dynamic pricing based on hotelId/randomness
        const basePriceFactor = hotelId.includes('dubai') ? 150 : 100;

        return MOCK_ROOMS.map(room => ({
            roomTypeId: room.id,
            basePrice: basePriceFactor + Math.floor(Math.random() * 50), // Random flux
            currency: "USD",
            availableQuantity: 5 + Math.floor(Math.random() * 15) // Random availability
        }));
    }

    // Expose mock rooms for reference
    async getRoomTypes(): Promise<RoomType[]> {
        return MOCK_ROOMS;
    }
}

export const tboClient = TBOApiClient.getInstance();

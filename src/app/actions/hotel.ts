'use server'

import { tboClient } from "@/lib/tbo-api";

export async function searchHotelsAction(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const hotels = await tboClient.searchHotels(query);
        return hotels;
    } catch (error) {
        console.error("Failed to search hotels:", error);
        return [];
    }
}

export async function getHotelDetailsAction(hotelId: string) {
    try {
        const hotel = await tboClient.getHotelDetails(hotelId);
        return hotel;
    } catch (error) {
        console.error("Failed to get hotel details:", error);
        return null;
    }
}

export async function getHotelInventoryAction(hotelId: string, checkIn: Date, checkOut: Date) {
    try {
        // Fetch raw API rates
        const rates = await tboClient.getRoomRates(hotelId, checkIn, checkOut);

        // Fetch room definitions to map names
        const roomTypes = await tboClient.getRoomTypes();

        // Combine into a usable format for the frontend
        return rates.map(rate => {
            const roomType = roomTypes.find(rt => rt.id === rate.roomTypeId);
            return {
                ...rate,
                name: roomType?.name || "Unknown Room",
                maxOccupancy: roomType?.maxOccupancy || 2
            };
        });
    } catch (error) {
        console.error("Failed to get hotel inventory:", error);
        return [];
    }
}

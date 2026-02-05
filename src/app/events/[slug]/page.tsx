"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Check, Star, ArrowRight } from "lucide-react"

// Mock Data (simulating DB fetch based on slug)
const EVENT_DATA = {
    name: "Sarah & Raj Wedding",
    dates: "Dec 12 - Dec 15, 2026",
    location: "Grand Hyatt Dubai",
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?fit=crop&w=1200&h=600",
    description: "We are so excited to celebrate our special day with you! We've secured exclusive rates for our guests using EventStay.",
    rooms: [
        { id: "r1", name: "King Room", price: 250, originalPrice: 350, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=500&h=300", features: ["King Bed", "City View", "Breakfast Included"] },
        { id: "r2", name: "Twin Room", price: 250, originalPrice: 350, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?fit=crop&w=500&h=300", features: ["Two Twin Beds", "City View", "Breakfast Included"] },
        { id: "r3", name: "Executive Suite", price: 550, originalPrice: 800, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?fit=crop&w=500&h=300", features: ["King Bed", "Lounge Access", "Ocean View", "Airport Transfer"] },
    ]
}

export default function EventMicrosite({ params }: { params: { slug: string } }) {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
    const [booked, setBooked] = useState(false)

    const handleBook = (roomId: string) => {
        setSelectedRoom(roomId)
        // Simulating booking process
        setTimeout(() => setBooked(true), 1500)
    }

    if (booked) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card border rounded-2xl shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
                        <p className="text-muted-foreground mt-2">You're all set for Sarah & Raj's Wedding.</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-left text-sm space-y-2">
                        <div className="flex justify-between"><span>Check-in:</span> <span className="font-semibold">Dec 12, 2026</span></div>
                        <div className="flex justify-between"><span>Check-out:</span> <span className="font-semibold">Dec 15, 2026</span></div>
                        <div className="flex justify-between"><span>Reference:</span> <span className="font-mono">#TB-8823</span></div>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => setBooked(false)}>Download Pass</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={EVENT_DATA.heroImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium mb-4 uppercase tracking-wider">Official Room Block</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{EVENT_DATA.name}</h1>
                    <div className="flex items-center gap-6 text-lg font-medium">
                        <span className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {EVENT_DATA.dates}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {EVENT_DATA.location}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto -mt-20 relative z-30 px-4">
                {/* About Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border">
                    <h2 className="text-2xl font-bold mb-4">Welcome Guests</h2>
                    <p className="text-slate-600 leading-relaxed">{EVENT_DATA.description}</p>
                </div>

                {/* Room Selection */}
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Select Your Room</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {EVENT_DATA.rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden border transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
                            <div className="h-48 bg-slate-200 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                                    Save ${room.originalPrice - room.price}
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2">{room.name}</h4>
                                <ul className="mb-6 space-y-2">
                                    {room.features.map((f, i) => (
                                        <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                            <Star className="h-3 w-3 text-primary fill-current" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-end justify-between mt-auto">
                                    <div>
                                        <span className="text-sm text-slate-400 line-through">${room.originalPrice}</span>
                                        <div className="text-2xl font-bold text-primary">${room.price}<span className="text-sm font-normal text-slate-500">/night</span></div>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-4"
                                    onClick={() => handleBook(room.id)}
                                    disabled={selectedRoom === room.id}
                                >
                                    {selectedRoom === room.id ? "Processing..." : "Book Now"} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-20 py-8 text-center text-slate-400 text-sm">
                Powered by EventStay © 2026
            </footer>
        </div>
    )
}

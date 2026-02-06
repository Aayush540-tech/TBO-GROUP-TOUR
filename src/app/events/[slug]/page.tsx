import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Check, Star, ArrowRight } from "lucide-react"
import { getEventBySlug, createBooking } from "@/app/actions"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'

export default async function EventMicrosite({ params }: { params: { slug: string } }) {
    const event = await getEventBySlug(params.slug)

    if (!event) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.imageUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?fit=crop&w=1200&h=600"} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium mb-4 uppercase tracking-wider">Official Room Block</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{event.name}</h1>
                    <div className="flex items-center gap-6 text-lg font-medium">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Dubai (TBO)</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto -mt-20 relative z-30 px-4">
                {/* About Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border">
                    <h2 className="text-2xl font-bold mb-4">Welcome Guests</h2>
                    <p className="text-slate-600 leading-relaxed">{event.description || "Welcome to our special event!"}</p>
                </div>

                {/* Room Selection */}
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Select Your Room</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {event.inventory.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden border transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
                            <div className="h-48 bg-slate-200 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={"https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=500&h=300"} alt={room.roomTypeName} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                                    {room.totalAllocated - room.consumed} Left
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2">{room.roomTypeName}</h4>
                                <ul className="mb-6 space-y-2">
                                    <li className="text-sm text-slate-600 flex items-center gap-2">
                                        <Star className="h-3 w-3 text-primary fill-current" /> Breakfast Included
                                    </li>
                                    <li className="text-sm text-slate-600 flex items-center gap-2">
                                        <Star className="h-3 w-3 text-primary fill-current" /> Free Sanitisation
                                    </li>
                                </ul>
                                <div className="flex items-end justify-between mt-auto">
                                    <div>
                                        <span className="text-sm text-slate-400 line-through">${room.price + 50}</span>
                                        <div className="text-2xl font-bold text-primary">${room.price}<span className="text-sm font-normal text-slate-500">/night</span></div>
                                    </div>
                                </div>

                                {/* Booking Form (Using Server Action) */}
                                <form action={async (formData) => {
                                    'use server'
                                    await createBooking(null, formData)
                                    redirect(`/events/${params.slug}?success=true`)
                                }} className="mt-4">
                                    <input type="hidden" name="eventId" value={event.id} />
                                    <input type="hidden" name="inventoryId" value={room.id} />
                                    <input type="hidden" name="guestName" value="Guest User" />
                                    <input type="hidden" name="guestEmail" value="guest@example.com" />
                                    <input type="hidden" name="checkIn" value={event.startDate.toISOString()} />
                                    <input type="hidden" name="checkOut" value={event.endDate.toISOString()} />
                                    <input type="hidden" name="totalPrice" value={room.price} />

                                    <Button
                                        className="w-full"
                                        disabled={room.totalAllocated <= room.consumed}
                                    >
                                        {room.totalAllocated <= room.consumed ? "Sold Out" : "Book Now"} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronRight, Check, Search, Calendar, Hotel, DollarSign, ArrowRight } from "lucide-react"
import { createEvent } from "@/app/actions"

// Mock Data for Hotels
const MOCK_HOTELS = [
    {
        id: "h1", name: "Grand Hyatt Dubai", location: "Dubai, UAE", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=300&h=200", rooms: [
            { id: "r1", name: "King Room", price: 200 },
            { id: "r2", name: "Twin Room", price: 200 },
            { id: "r3", name: "Suite", price: 450 }
        ]
    },
    {
        id: "h2", name: "Atlantis The Palm", location: "Palm Jumeirah", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?fit=crop&w=300&h=200", rooms: [
            { id: "r4", name: "Ocean View", price: 350 },
            { id: "r5", name: "Palm View", price: 380 }
        ]
    },
]

export default function CreateEventWizard() {
    const [step, setStep] = useState(1)

    // Form State
    const [formData, setFormData] = useState({
        eventName: "",
        eventSlug: "",
        startDate: "",
        endDate: "",
    })

    const [selectedHotel, setSelectedHotel] = useState<any>(null)

    // Selection: { roomTypeId: { quantity, markup } }
    const [inventory, setInventory] = useState<Record<string, { quantity: number, markup: number, cost: number, name: string }>>({})

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleInventoryChange = (roomId: string, field: string, value: string, cost: number, name: string) => {
        const existing = inventory[roomId] || { quantity: 0, markup: 0, cost, name }
        setInventory({
            ...inventory,
            [roomId]: { ...existing, [field]: Number(value) }
        })
    }

    // Render Steps
    return (
        <div className="max-w-4xl mx-auto py-10">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {["Event Details", "Select Hotel", "Lock Inventory", "Review"].map((label, idx) => (
                        <div key={idx} className={`flex flex-col items-center flex-1 ${step > idx + 1 ? "text-primary" : step === idx + 1 ? "text-primary font-bold" : "text-muted-foreground"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${step > idx + 1 ? "bg-primary border-primary text-white" : step === idx + 1 ? "border-primary text-primary" : "border-muted text-muted-foreground"}`}>
                                {step > idx + 1 ? <Check className="h-4 w-4" /> : idx + 1}
                            </div>
                            <span className="text-xs">{label}</span>
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300 ease-in-out" style={{ width: `${(step / 4) * 100}%` }} />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-card border rounded-xl p-8 shadow-sm min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Event Details</h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="eventName">Event Name</Label>
                                <Input id="eventName" name="eventName" placeholder="e.g. Sarah & Raj Wedding" value={formData.eventName} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="eventSlug">Event URL Slug</Label>
                                <div className="flex items-center">
                                    <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">events.tbo.com/</span>
                                    <Input id="eventSlug" name="eventSlug" className="rounded-l-none" placeholder="sarah-raj-wedding" value={formData.eventSlug} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Select Hotel Property</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search hotels in Dubai..." className="pl-10" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {MOCK_HOTELS.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary ${selectedHotel?.id === hotel.id ? "ring-2 ring-primary bg-primary/5" : ""}`}
                                    onClick={() => setSelectedHotel(hotel)}
                                >
                                    <div className="h-32 bg-gray-200 w-full relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold">{hotel.name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Hotel className="h-3 w-3" /> {hotel.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Lock Inventory & Set Rates</h2>
                        {selectedHotel ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-lg">
                                    <Hotel className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="font-bold">{selectedHotel.name}</h3>
                                        <p className="text-sm text-muted-foreground">Define allocation and markup for each room type.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {selectedHotel.rooms.map((room: any) => (
                                        <div key={room.id} className="grid grid-cols-12 gap-4 items-center border p-4 rounded-lg">
                                            <div className="col-span-12 md:col-span-4">
                                                <h4 className="font-semibold">{room.name}</h4>
                                                <p className="text-sm text-muted-foreground">Net Rate: ${room.price}</p>
                                            </div>
                                            <div className="col-span-6 md:col-span-3">
                                                <Label className="text-xs">Quantity to Lock</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    className="h-8"
                                                    placeholder="0"
                                                    onChange={(e) => handleInventoryChange(room.id, "quantity", e.target.value, room.price, room.name)}
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-3">
                                                <Label className="text-xs">Markup ($)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    className="h-8"
                                                    placeholder="0"
                                                    onChange={(e) => handleInventoryChange(room.id, "markup", e.target.value, room.price, room.name)}
                                                />
                                            </div>
                                            <div className="col-span-12 md:col-span-2 text-right">
                                                <div className="text-xs text-muted-foreground">Guest Price</div>
                                                <div className="font-bold text-lg text-primary">
                                                    ${((inventory[room.id]?.markup || 0) + room.price)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">Please select a hotel first.</div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-center">Ready to Publish!</h2>
                        <div className="bg-muted/10 p-6 rounded-xl border max-w-md mx-auto space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">{formData.eventName}</h3>
                                <p className="text-muted-foreground text-sm">events.tbo.com/{formData.eventSlug}</p>
                            </div>
                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Dates:</span>
                                    <span>{formData.startDate} to {formData.endDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Hotel:</span>
                                    <span>{selectedHotel?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Rooms Locked:</span>
                                    <span className="font-bold">
                                        {Object.values(inventory).reduce((acc: any, curr: any) => acc + (curr.quantity || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center pt-4">
                            <p className="text-sm text-muted-foreground mb-4">Publishing will secure the inventory and generate the microsite.</p>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500 text-center py-10">
                        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                            <Check className="h-12 w-12" />
                        </div>
                        <h2 className="text-3xl font-bold">Microsite Live!</h2>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Your event is now bookable. Share the link with your guests or send an automated WhatsApp blast.
                        </p>

                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button variant="outline" className="gap-2">
                                <Link href={`/events/${formData.eventSlug}`} target="_blank">View Microsite</Link> <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Share on WhatsApp
                            </Button>
                        </div>
                    </div>
                )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                {step < 5 && (
                    <>
                        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                            Back
                        </Button>
                        {step < 4 ? (
                            <Button onClick={handleNext} disabled={step === 2 && !selectedHotel}>
                                Next Step <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <form action={async () => {
                                const data = new FormData()
                                data.append('name', formData.eventName)
                                data.append('slug', formData.eventSlug)
                                data.append('startDate', formData.startDate)
                                data.append('endDate', formData.endDate)
                                data.append('hotelId', selectedHotel.id)
                                data.append('hotelName', selectedHotel.name)

                                // Format inventory for server
                                const inventoryList = Object.keys(inventory).map(key => ({
                                    id: key,
                                    ...inventory[key]
                                }))
                                data.append('inventory', JSON.stringify(inventoryList))

                                await createEvent(data) // Server Action
                                setStep(5)
                            }}>
                                <Button size="lg" className="px-8 bg-primary hover:bg-primary/90" type="submit">
                                    Publish Microsite 🚀
                                </Button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MapPin, Star, Plus, Trash2, Check, ExternalLink, Loader2, Search, ChevronRight, Hotel as HotelIcon, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { createEvent, getEvents } from "@/app/actions"
import { searchHotelsAction, getHotelInventoryAction } from "@/app/actions/hotel"
import Link from "next/link"

// Types
import { type Hotel } from "@/lib/tbo-api"

export default function CreateEventWizard() {
    const [step, setStep] = useState(1)

    // Form State
    const [formData, setFormData] = useState({
        eventName: "",
        eventSlug: "",
        startDate: "",
        endDate: "",
    })

    // Hotel Search State
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Hotel[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

    // Selection: { roomTypeId: { quantity, markup, cost, name } }
    const [inventory, setInventory] = useState<Record<string, { quantity: number, markup: number, cost: number, name: string }>>({})
    const [isLoadingInventory, setIsLoadingInventory] = useState(false)
    const [availableRooms, setAvailableRooms] = useState<any[]>([])

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Live Search Handler
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true)
                try {
                    const results = await searchHotelsAction(searchQuery)
                    setSearchResults(results)
                } catch (error) {
                    console.error("Search failed", error)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSearchResults([])
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery])

    // Load available rooms when moving to inventory step
    useEffect(() => {
        if (step === 3 && selectedHotel && formData.startDate && formData.endDate) {
            const fetchInventory = async () => {
                setIsLoadingInventory(true)
                try {
                    const rooms = await getHotelInventoryAction(
                        selectedHotel.id,
                        new Date(formData.startDate),
                        new Date(formData.endDate)
                    )
                    setAvailableRooms(rooms)
                } catch (error) {
                    console.error("Failed to load inventory", error)
                } finally {
                    setIsLoadingInventory(false)
                }
            }
            fetchInventory()
        }
    }, [step, selectedHotel, formData.startDate, formData.endDate])


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
                            <Input
                                placeholder="Search hotels (e.g. Dubai, Taj)..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-2.5">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {searchResults.length > 0 ? (
                                searchResults.map((hotel) => (
                                    <div
                                        key={hotel.id}
                                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary ${selectedHotel?.id === hotel.id ? "ring-2 ring-primary bg-primary/5" : ""}`}
                                        onClick={() => setSelectedHotel(hotel)}
                                    >
                                        <div className="h-32 bg-gray-200 w-full relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold">{hotel.name}</h3>
                                                <div className="flex items-center text-yellow-500 text-xs">
                                                    <Star className="h-3 w-3 fill-current" /> {hotel.rating}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {hotel.location}</p>
                                            <div className="flex gap-1 mt-2 flex-wrap">
                                                {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{amenity}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : searchQuery.length > 2 && !isSearching ? (
                                <div className="col-span-2 text-center py-8 text-muted-foreground">
                                    No hotels found matching "{searchQuery}"
                                </div>
                            ) : (
                                <div className="col-span-2 text-center py-8 text-muted-foreground">
                                    Start typing to search TBO's hotel inventory...
                                </div>
                            )}
                        </div>
                        {selectedHotel && (
                            <div className="bg-primary/10 text-primary p-3 rounded-md text-sm font-medium flex items-center gap-2">
                                <Check className="h-4 w-4" /> Selected: {selectedHotel.name}
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Lock Inventory & Set Rates</h2>
                        {selectedHotel ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-lg">
                                    <HotelIcon className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="font-bold">{selectedHotel.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Live rates for {formData.startDate} to {formData.endDate}
                                        </p>
                                    </div>
                                </div>

                                {isLoadingInventory ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                        <p>Fetching real-time availability...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {availableRooms.map((room: any) => (
                                            <div key={room.roomTypeId} className="grid grid-cols-12 gap-4 items-center border p-4 rounded-lg">
                                                <div className="col-span-12 md:col-span-4">
                                                    <h4 className="font-semibold">{room.name}</h4>
                                                    <div className="text-sm text-muted-foreground flex gap-2 items-center">
                                                        <span>Net: ${room.basePrice}</span>
                                                        <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">{room.availableQuantity} available</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-6 md:col-span-3">
                                                    <Label className="text-xs">Quantity to Lock</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max={room.availableQuantity}
                                                        className="h-8"
                                                        placeholder="0"
                                                        onChange={(e) => handleInventoryChange(room.roomTypeId, "quantity", e.target.value, room.basePrice, room.name)}
                                                    />
                                                </div>
                                                <div className="col-span-6 md:col-span-3">
                                                    <Label className="text-xs">Markup ($)</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="h-8"
                                                        placeholder="0"
                                                        onChange={(e) => handleInventoryChange(room.roomTypeId, "markup", e.target.value, room.basePrice, room.name)}
                                                    />
                                                </div>
                                                <div className="col-span-12 md:col-span-2 text-right">
                                                    <div className="text-xs text-muted-foreground">Guest Price</div>
                                                    <div className="font-bold text-lg text-primary">
                                                        ${((inventory[room.roomTypeId]?.markup || 0) + room.basePrice)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                            <Link href={`/events/${formData.eventSlug}`} target="_blank" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
                                View Microsite <ArrowRight className="h-4 w-4" />
                            </Link>
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
                            <Button onClick={handleNext} disabled={(step === 2 && !selectedHotel) || (step === 1 && !formData.eventName)}>
                                Next Step <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <form action={async () => {
                                if (!selectedHotel) {
                                    alert("Please select a hotel first")
                                    return
                                }

                                const data = new FormData()
                                data.append('name', formData.eventName)
                                data.append('slug', formData.eventSlug)
                                data.append('startDate', formData.startDate)
                                data.append('endDate', formData.endDate)

                                data.append('hotelId', selectedHotel.id)
                                data.append('hotelName', selectedHotel.name)

                                // Format inventory for server
                                const inventoryList = Object.keys(inventory)
                                    .map(key => {
                                        const item = inventory[key]
                                        return {
                                            id: key,
                                            roomTypeId: key,
                                            name: item.name, // Ensure this persists from handleInventoryChange
                                            price: Number(item.cost), // Base cost
                                            markup: Number(item.markup),
                                            quantity: Number(item.quantity)
                                        }
                                    })
                                    .filter(item => item.quantity > 0) // Only send rooms with allocation

                                if (inventoryList.length === 0) {
                                    alert("Please allocate at least one room (quantity > 0).")
                                    return
                                }

                                // Adapting to existing createEvent schema
                                const adaptedInventory = inventoryList.map(item => ({
                                    // Required by Prisma schema
                                    hotelId: selectedHotel.id,
                                    hotelName: selectedHotel.name,

                                    roomTypeId: item.id,
                                    roomTypeName: item.name,

                                    totalAllocated: item.quantity,
                                    price: item.price + item.markup // Final price
                                }))

                                const result = await createEvent(data) // Server Action
                                if (result?.success) {
                                    setStep(5)
                                } else {
                                    alert(result?.error || "Something went wrong creating the event.")
                                }
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

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createEvent(formData: FormData) {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(formData.get('endDate') as string)
    const hotelId = formData.get('hotelId') as string
    const hotelName = formData.get('hotelName') as string

    // Inventory Data (parsed from hidden input or separate form logic)
    // For MVP simplification, we're assuming inventory is passed as a JSON string
    const inventoryData = JSON.parse(formData.get('inventory') as string || '[]')

    // Mock Admin ID (in a real app, this comes from session)
    // Ensure we have at least one admin
    let admin = await prisma.admin.findFirst()
    if (!admin) {
        admin = await prisma.admin.create({
            data: {
                email: 'demo@tbo.com',
                name: 'Demo Agent',
                password: 'hashedpassword'
            }
        })
    }

    const event = await prisma.event.create({
        data: {
            name,
            slug,
            startDate,
            endDate,
            adminId: admin.id,
            imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?fit=crop&w=1200&h=600",
            description: "Welcome to our exclusive event! Book your stay with our negotiated rates.",
            inventory: {
                create: inventoryData.map((item: any) => ({
                    hotelId,
                    hotelName,
                    roomTypeId: item.id,
                    roomTypeName: item.name,
                    totalAllocated: Number(item.quantity),
                    price: Number(item.cost) + Number(item.markup)
                }))
            }
        }
    })

    revalidatePath('/admin')
    redirect(`/admin`)
}

export async function getEvents() {
    return await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { bookings: true }
            }
        }
    })
}

export async function getEventBySlug(slug: string) {
    return await prisma.event.findUnique({
        where: { slug },
        include: {
            inventory: true
        }
    })
}

export async function createBooking(prevState: any, formData: FormData) {
    const eventId = formData.get('eventId') as string
    const inventoryId = formData.get('inventoryId') as string
    const guestName = formData.get('guestName') as string
    const guestEmail = formData.get('guestEmail') as string
    const checkIn = new Date(formData.get('checkIn') as string)
    const checkOut = new Date(formData.get('checkOut') as string)
    const totalPrice = Number(formData.get('totalPrice'))

    await prisma.booking.create({
        data: {
            eventId,
            inventoryBlockId: inventoryId,
            guestName,
            guestEmail,
            checkIn,
            checkOut,
            totalPrice
        }
    })

    // Update consumed count
    await prisma.inventoryBlock.update({
        where: { id: inventoryId },
        data: {
            consumed: { increment: 1 }
        }
    })

    return { message: 'Booking confirmed!' }
}

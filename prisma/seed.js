const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Delete existing demo admin if exists
    await prisma.admin.deleteMany({
        where: { email: 'demo@tbo.com' }
    })

    // Create demo admin
    const admin = await prisma.admin.create({
        data: {
            email: 'demo@tbo.com',
            name: 'Demo Agent',
            password: '123456' // Plain text for demo - in production use bcrypt
        }
    })

    console.log('✅ Demo admin created:')
    console.log('   Email:', admin.email)
    console.log('   Password: 123456')
    console.log('   Name:', admin.name)
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

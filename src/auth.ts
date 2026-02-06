import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { authConfig } from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                console.log('🔐 Auth attempt:', credentials?.email)

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ Missing credentials')
                    return null
                }

                try {
                    // Check if admin exists
                    const admin = await prisma.admin.findUnique({
                        where: { email: credentials.email as string }
                    })

                    console.log('👤 Admin found:', admin ? 'YES' : 'NO')
                    if (admin) {
                        console.log('🔑 Password match:', admin.password === credentials.password)
                        console.log('   DB password:', admin.password)
                        console.log('   Input password:', credentials.password)
                    }

                    // Validate password
                    if (admin && admin.password === credentials.password) {
                        console.log('✅ Authentication successful')
                        return {
                            id: admin.id,
                            name: admin.name,
                            email: admin.email,
                        }
                    }

                    console.log('❌ Authentication failed')
                    return null
                } catch (error) {
                    console.error('💥 Auth error:', error)
                    return null
                }
            },
        }),
    ],
})

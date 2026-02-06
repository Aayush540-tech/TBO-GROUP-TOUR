'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid credentials. Please try again.')
            } else if (result?.ok) {
                window.location.href = '/admin'
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg border space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Admin Login</h1>
                    <p className="text-sm text-muted-foreground">Enter your credentials to manage events.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="demo@tbo.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}
                </form>

                <div className="text-xs text-center text-muted-foreground">
                    Demo: demo@tbo.com / 123456
                </div>
            </div>
        </div>
    )
}

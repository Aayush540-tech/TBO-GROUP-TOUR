import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">EventStay <span className="text-muted-foreground text-sm font-normal">| Admin Panel</span></h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm">Agent: {session?.user?.name || 'Unknown'}</span>
                    <form action={async () => {
                        'use server'
                        await signOut()
                    }}>
                        <Button variant="outline" size="sm" type="submit">
                            Sign Out
                        </Button>
                    </form>
                </div>
            </header>
            <main className="flex-1 p-6 md:p-10 bg-muted/10">
                {children}
            </main>
        </div>
    )
}

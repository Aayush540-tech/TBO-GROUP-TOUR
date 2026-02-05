export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">EventStay <span className="text-muted-foreground text-sm font-normal">| Admin Panel</span></h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm">Agent: Ayush</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">A</div>
                </div>
            </header>
            <main className="flex-1 p-6 md:p-10 bg-muted/10">
                {children}
            </main>
        </div>
    )
}

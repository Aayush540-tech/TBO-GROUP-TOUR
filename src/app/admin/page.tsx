import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Manage your event microsites and room blocks.</p>
                </div>
                <Link href="/admin/events/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create New Event
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Events" value="12" />
                <DashboardCard title="Active Room Blocks" value="450" />
                <DashboardCard title="Total Bookings" value="1,234" />
                <DashboardCard title="Revenue (Est.)" value="$125,000" />
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Recent Events</h3>
                </div>
                <div className="p-6 pt-0">
                    <div className="space-y-4">
                        {/* Mock Data List */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">Sarah & Raj Wedding</p>
                                    <p className="text-sm text-muted-foreground">Dec 12 - Dec 15, 2026</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function DashboardCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    )
}

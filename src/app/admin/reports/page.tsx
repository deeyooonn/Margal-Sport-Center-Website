import { Download, TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const monthlyRevenue = [
  { month: 'Jan', revenue: 28400, bookings: 42 },
  { month: 'Feb', revenue: 31200, bookings: 48 },
  { month: 'Mar', revenue: 29800, bookings: 45 },
  { month: 'Apr', revenue: 38500, bookings: 56 },
  { month: 'May', revenue: 48200, bookings: 71 },
]

const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))

export default function AdminReportsPage() {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Reports</h1>
          <p className="text-sm text-muted-foreground">Booking and revenue analytics</p>
        </div>
        <Button id="export-report" size="sm" variant="outline" className="border-border hover:bg-accent rounded-xl gap-2 font-semibold">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue (2026)', value: '₱176,100', icon: DollarSign, sub: 'Jan – May' },
          { label: 'Total Bookings', value: '262', icon: Calendar, sub: 'All-time' },
          { label: 'Avg. Revenue/Month', value: '₱35,220', icon: TrendingUp, sub: 'Based on 5 months' },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="text-2xl font-black mb-0.5">{value}</div>
            <div className="text-xs font-medium text-foreground mb-0.5">{label}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-sm uppercase tracking-wider">Monthly Revenue</h2>
        </div>
        <div className="flex items-end gap-3 h-48">
          {monthlyRevenue.map((m) => {
            const heightPct = (m.revenue / maxRevenue) * 100
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-muted-foreground font-mono">₱{(m.revenue / 1000).toFixed(0)}k</div>
                <div className="w-full relative" style={{ height: `${heightPct}%` }}>
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary/80 hover:to-primary/40"
                    style={{ height: '100%' }}
                  />
                </div>
                <div className="text-xs font-bold text-muted-foreground">{m.month}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-sm uppercase tracking-wider">Monthly Breakdown</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Month', 'Bookings', 'Revenue', 'Avg. per Booking'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {monthlyRevenue.map((m) => (
              <tr key={m.month} className="hover:bg-accent/30 transition-colors">
                <td className="px-6 py-4 font-medium">{m.month} 2026</td>
                <td className="px-6 py-4 text-muted-foreground">{m.bookings}</td>
                <td className="px-6 py-4 font-bold text-primary">₱{m.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 text-muted-foreground">₱{Math.round(m.revenue / m.bookings).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

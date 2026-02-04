import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'

const stats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '-3.1%',
    trend: 'down',
    icon: DollarSign,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    title: 'Growth',
    value: '+24.5%',
    change: '+5.7%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
]

const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', date: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', date: '2024-01-14' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'pending', date: '2024-01-13' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', date: '2024-01-12' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', status: 'inactive', date: '2024-01-11' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}>
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent users table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-4 text-sm font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        user.status === 'active' && 'bg-green-500/10 text-green-500',
                        user.status === 'pending' && 'bg-yellow-500/10 text-yellow-500',
                        user.status === 'inactive' && 'bg-red-500/10 text-red-500',
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

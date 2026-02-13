import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import { RoleBasedButton } from '@/components/common/RoleBasedButton'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-01-14' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'pending', createdAt: '2024-01-13' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', createdAt: '2024-01-12' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-11' },
]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage your users and their permissions.</p>
        </div>
        <RoleBasedButton allowedRoles={['admin']} onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </RoleBasedButton>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-medium">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        user.role === 'admin' && 'bg-purple-500/10 text-purple-500',
                        user.role === 'user' && 'bg-blue-500/10 text-blue-500',
                      )}>
                        {user.role}
                      </span>
                    </td>
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
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="relative inline-block">
                        <RoleBasedButton 
                          allowedRoles={['admin']}
                          variant="ghost"
                          size="icon"
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </RoleBasedButton>
                        {menuOpen === user.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setMenuOpen(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                                onClick={() => setMenuOpen(null)}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-accent rounded-md transition-colors"
                                onClick={() => setMenuOpen(null)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
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

'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Search, Filter, MoreVertical, UserCheck, UserX, Shield, Mail } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  role: 'parent' | 'tutor' | 'admin'
  avatar_url?: string
  created_at: string
  last_sign_in_at?: string
  is_active: boolean
  is_verified: boolean
}

export default function AdminUsers() {
  const { user } = useSupabase()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      // Mock data for demonstration - in production, this would fetch from your database
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'john.doe@example.com',
          full_name: 'John Doe',
          role: 'parent',
          created_at: '2024-01-15T10:30:00Z',
          last_sign_in_at: '2024-11-14T08:45:00Z',
          is_active: true,
          is_verified: true
        },
        {
          id: '2',
          email: 'sarah.chen@example.com',
          full_name: 'Sarah Chen',
          role: 'tutor',
          created_at: '2024-02-20T14:15:00Z',
          last_sign_in_at: '2024-11-14T09:20:00Z',
          is_active: true,
          is_verified: true
        },
        {
          id: '3',
          email: 'ahmad.iskandar@example.com',
          full_name: 'Ahmad Iskandar',
          role: 'parent',
          created_at: '2024-03-10T11:00:00Z',
          last_sign_in_at: '2024-11-13T16:30:00Z',
          is_active: true,
          is_verified: false
        },
        {
          id: '4',
          email: 'michael.kumar@example.com',
          full_name: 'Michael Kumar',
          role: 'tutor',
          created_at: '2024-01-25T09:45:00Z',
          last_sign_in_at: '2024-11-14T07:15:00Z',
          is_active: true,
          is_verified: true
        },
        {
          id: '5',
          email: 'fatima.ali@example.com',
          full_name: 'Fatima Ali',
          role: 'parent',
          created_at: '2024-04-05T16:20:00Z',
          last_sign_in_at: '2024-11-12T14:10:00Z',
          is_active: false,
          is_verified: true
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user =>
        statusFilter === 'active' ? user.is_active :
        statusFilter === 'inactive' ? !user.is_active :
        statusFilter === 'verified' ? user.is_verified :
        statusFilter === 'unverified' ? !user.is_verified : true
      )
    }

    setFilteredUsers(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const toggleUserStatus = async (userId: string) => {
    // In production, this would update the user status in your database
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ))
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'tutor':
        return 'bg-blue-100 text-blue-800'
      case 'parent':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout userRole="tutor" user={user}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="tutor" user={user}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage platform users and their access</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="parent">Parents</option>
                <option value="tutor">Tutors</option>
                <option value="admin">Admins</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {userItem.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userItem.full_name}</div>
                          <div className="text-sm text-gray-500">{userItem.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(userItem.created_at)}</div>
                      {userItem.last_sign_in_at && (
                        <div className="text-sm text-gray-500">Last: {formatDate(userItem.last_sign_in_at)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          userItem.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {userItem.is_verified ? (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                            <Mail className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleUserStatus(userItem.id)}
                          className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
                            userItem.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                          }`}
                          title={userItem.is_active ? 'Deactivate User' : 'Activate User'}
                        >
                          {userItem.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No users found</div>
              <div className="text-gray-400">Try adjusting your filters or search terms</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.filter(u => u.is_active).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.filter(u => u.is_verified).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">🔒</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
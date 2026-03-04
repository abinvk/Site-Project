import { useState } from 'react';
import { useStore } from '../store';
import { Users as UsersIcon, Plus, Search, Shield, Building2 } from 'lucide-react';

export default function Users() {
    const { users, sites } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">System Users</h1>
                    <p className="text-muted">Manage administrators, managers, and site supervisors.</p>
                </div>
                <button className="btn btn-primary shadow-md">
                    <Plus size={20} />
                    Add New User
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            className="input pl-10"
                            placeholder="Search by name, username, or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-[10px] text-secondary-400" size={20} />
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role & Access</th>
                                    <th className="hidden sm:table-cell">Assigned Site</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar avatar-sm bg-primary-100 text-primary-700">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-secondary-900">{user.name}</div>
                                                    <div className="text-xs text-secondary-500">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} className={
                                                    user.role === 'admin' ? 'text-danger-500' :
                                                        user.role === 'manager' ? 'text-primary-500' : 'text-success-500'
                                                } />
                                                <span className="capitalize font-medium text-sm text-secondary-700">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell text-sm">
                                            {user.role === 'supervisor' ? (
                                                <div className="flex items-center gap-1 text-secondary-600">
                                                    <Building2 size={14} />
                                                    {sites.find(s => s.id === user.assignedSiteId)?.name || <span className="text-warning-600">Unassigned</span>}
                                                </div>
                                            ) : (
                                                <span className="text-secondary-400 italic">Global Access</span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <button className="btn btn-sm btn-ghost text-primary-600 hover:text-primary-700">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-secondary-500">
                                            <UsersIcon size={48} className="mx-auto text-secondary-200 mb-4" />
                                            <p>No users found matching "{searchTerm}"</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

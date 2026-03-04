import { useState } from 'react';
import { useStore } from '../store';
import { Building2, Plus, Search, MapPin, Calendar } from 'lucide-react';

export default function Sites() {
    const { sites, currentUser } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSites = sites.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Construction Sites</h1>
                    <p className="text-muted">Manage and monitor all active and completed projects.</p>
                </div>
                {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                    <button className="btn btn-primary shadow-md">
                        <Plus size={20} />
                        Add New Site
                    </button>
                )}
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            className="input pl-10"
                            placeholder="Search sites by name or location..."
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
                                    <th>Site Information</th>
                                    <th>Status</th>
                                    <th className="hidden sm:table-cell">Supervisor</th>
                                    <th className="hidden md:table-cell">Started</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSites.map(site => (
                                    <tr key={site.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg hidden sm:block">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-secondary-900">{site.name}</div>
                                                    <div className="text-xs text-secondary-500 flex items-center gap-1 mt-1">
                                                        <MapPin size={12} /> {site.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${site.status === 'active' ? 'badge-success' :
                                                    site.status === 'completed' ? 'badge-primary' : 'badge-warning'
                                                } capitalize`}>
                                                {site.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="hidden sm:table-cell text-sm font-medium">
                                            {site.supervisorName || <span className="text-secondary-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="hidden md:table-cell text-sm text-secondary-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(site.startDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="btn btn-sm btn-secondary">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSites.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-secondary-500">
                                            No sites found matching "{searchTerm}"
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

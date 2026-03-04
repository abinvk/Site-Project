import { useMemo } from 'react';
import {
    Building2,
    Users,
    FileCheck,
    TrendingUp,
    Activity
} from 'lucide-react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { parseISO, subDays, isAfter } from 'date-fns';

export default function Dashboard() {
    const { sites, reports, currentUser } = useStore();

    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let activeSites = sites.filter(s => s.status === 'active').length;

        // Filter reports based on user role
        const relevantReports = currentUser?.role === 'supervisor'
            ? reports.filter(r => r.siteId === currentUser.assignedSiteId)
            : reports;

        const todaysReports = relevantReports.filter(r => {
            const reportDate = new Date(r.timestamp);
            return reportDate >= today;
        });

        const totalWorkersToday = todaysReports.reduce((sum, r) => sum + r.workersCount, 0);

        const sevenDaysAgo = subDays(new Date(), 7);
        const recentActivityCount = relevantReports.filter(r =>
            isAfter(parseISO(r.timestamp), sevenDaysAgo)
        ).length;

        return {
            activeSites,
            todaysReports: todaysReports.length,
            totalWorkersToday,
            recentActivityCount
        };
    }, [sites, reports, currentUser]);

    const recentReports = useMemo(() => {
        let filtered = reports;
        if (currentUser?.role === 'supervisor') {
            filtered = reports.filter(r => r.siteId === currentUser.assignedSiteId);
        }
        return filtered.slice(0, 5);
    }, [reports, currentUser]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                    <p className="text-muted">Welcome back, {currentUser?.name}. Here's what's happening.</p>
                </div>
                {currentUser?.role === 'supervisor' && (
                    <Link to="/submit" className="btn btn-primary btn-mobile-auto shadow-md">
                        Submit Today's Report
                    </Link>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                    <div className="card">
                        <div className="card-body p-6 flex items-center gap-4">
                            <div className="p-4 bg-primary-100 text-primary rounded-full">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted">Active Sites</p>
                                <h3 className="text-2xl font-bold">{stats.activeSites}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card">
                    <div className="card-body p-6 flex items-center gap-4">
                        <div className="p-4 bg-success-50 text-success rounded-full">
                            <FileCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">Today's Reports</p>
                            <h3 className="text-2xl font-bold">{stats.todaysReports}</h3>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body p-6 flex items-center gap-4">
                        <div className="p-4 bg-warning-50 text-warning rounded-full">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">Workers Today</p>
                            <h3 className="text-2xl font-bold">{stats.totalWorkersToday}</h3>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body p-6 flex items-center gap-4">
                        <div className="p-4 bg-secondary-100 text-secondary-600 rounded-full">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">Past 7 Days updates</p>
                            <h3 className="text-2xl font-bold">{stats.recentActivityCount}</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* Recent Activity */}
            <div className="card shadow-sm mt-6">
                <div className="card-header bg-white">
                    <h2 className="card-title flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" />
                        Recent Work Activity
                    </h2>
                    <Link to="/reports" className="text-sm text-primary font-medium hover:underline">
                        View all
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Site & Date</th>
                                    <th className="hidden md:table-cell">Supervisor</th>
                                    <th>Workers</th>
                                    <th className="hidden sm:table-cell">Task</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReports.map(report => (
                                    <tr key={report.id}>
                                        <td>
                                            <div className="font-semibold">{report.siteName}</div>
                                            <div className="text-xs text-muted">{new Date(report.timestamp).toLocaleString()}</div>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="avatar avatar-sm">{report.supervisorName.charAt(0)}</div>
                                                <span className="text-sm font-medium">{report.supervisorName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">{report.workersCount}</span>
                                        </td>
                                        <td className="hidden sm:table-cell text-sm text-muted max-w-xs truncate">
                                            {report.workDescription}
                                        </td>
                                    </tr>
                                ))}
                                {recentReports.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-6 text-muted">
                                            No recent work activity.
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

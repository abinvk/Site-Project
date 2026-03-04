import { useState, useMemo } from 'react';
import { Search, Filter, FileText, Image as ImageIcon, X } from 'lucide-react';
import { useStore } from '../store';
import { parseISO, isAfter, isBefore, startOfDay, endOfDay, subDays } from 'date-fns';

export default function Reports() {
    const { reports, sites, currentUser } = useStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [selectedRange, setSelectedRange] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    const filteredReports = useMemo(() => {
        let result = reports;

        // Supervisor can only see their site
        if (currentUser?.role === 'supervisor' && currentUser.assignedSiteId) {
            result = result.filter(r => r.siteId === currentUser.assignedSiteId);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(
                r =>
                    r.siteName.toLowerCase().includes(lowerSearch) ||
                    r.supervisorName.toLowerCase().includes(lowerSearch) ||
                    r.workDescription.toLowerCase().includes(lowerSearch) ||
                    r.materialsUsed.toLowerCase().includes(lowerSearch)
            );
        }

        if (selectedSite) {
            result = result.filter(r => r.siteId === selectedSite);
        }

        const today = startOfDay(new Date());

        if (selectedRange === '7') {
            const sevenDaysAgo = subDays(today, 7);
            result = result.filter(r => isAfter(parseISO(r.timestamp), sevenDaysAgo));
        } else if (selectedRange === '30') {
            const thirtyDaysAgo = subDays(today, 30);
            result = result.filter(r => isAfter(parseISO(r.timestamp), thirtyDaysAgo));
        } else if (selectedRange === 'custom') {
            if (startDate) {
                result = result.filter(r => isAfter(parseISO(r.timestamp), startOfDay(parseISO(startDate))));
            }
            if (endDate) {
                result = result.filter(r => isBefore(parseISO(r.timestamp), endOfDay(parseISO(endDate))));
            }
        }

        return result;
    }, [reports, searchTerm, selectedSite, selectedRange, startDate, endDate, currentUser]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Work Reports</h1>
                    <p className="text-muted">Search and view daily work history logs.</p>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-4 sm:p-6 bg-secondary-50 border-b space-y-4">
                    <div className="flex items-center gap-2 mb-2 font-medium text-secondary-700">
                        <Filter size={18} /> Filters & Search
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-group mb-0 relative">
                            <input
                                type="text"
                                className="input pl-10 h-full"
                                placeholder="Search description, name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-3 text-secondary-400" size={18} />
                        </div>

                        {currentUser?.role !== 'supervisor' && (
                            <div className="form-group mb-0">
                                <select
                                    className="select h-full"
                                    value={selectedSite}
                                    onChange={(e) => setSelectedSite(e.target.value)}
                                >
                                    <option value="">All Sites</option>
                                    {sites.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group mb-0">
                            <select
                                className="select h-full"
                                value={selectedRange}
                                onChange={(e) => setSelectedRange(e.target.value)}
                            >
                                <option value="all">All Time</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="custom">Custom Date Range</option>
                            </select>
                        </div>

                        {selectedRange === 'custom' && (
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    className="input h-full w-full"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    title="Start Date"
                                />
                                <input
                                    type="date"
                                    className="input h-full w-full"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    title="End Date"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="min-w-[150px]">Date & Time</th>
                                    <th className="min-w-[150px]">Site Details</th>
                                    <th>Work Summary</th>
                                    <th className="w-24 text-center">Media</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map(report => (
                                    <tr key={report.id}>
                                        <td>
                                            <div className="font-semibold">{new Date(report.timestamp).toLocaleDateString()}</div>
                                            <div className="text-xs text-muted font-mono">{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td>
                                            <div className="font-semibold text-primary">{report.siteName}</div>
                                            <div className="text-sm">Sup: {report.supervisorName}</div>
                                            <span className="badge badge-secondary mt-1">{report.workersCount} Workers</span>
                                        </td>
                                        <td className="max-w-md">
                                            <div className="mb-2">
                                                <span className="text-xs font-bold text-secondary-500 uppercase">Work Done:</span><br />
                                                <span className="text-sm">{report.workDescription}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-secondary-500 uppercase">Materials:</span><br />
                                                <span className="text-sm">{report.materialsUsed}</span>
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            {report.photoUrl ? (
                                                <button
                                                    onClick={() => setPreviewPhoto(report.photoUrl!)}
                                                    className="btn btn-ghost p-2 text-primary hover:bg-primary-50 rounded-lg inline-flex"
                                                    title="View Photo"
                                                >
                                                    <ImageIcon size={24} />
                                                </button>
                                            ) : (
                                                <span className="text-secondary-300 text-xs">No Photo</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {filteredReports.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-muted">
                                            <FileText size={48} className="mx-auto text-secondary-200 mb-4" />
                                            <p className="font-medium text-lg text-secondary-900">No reports found</p>
                                            <p>Try adjusting your search criteria or date range.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t text-sm text-secondary-500 text-right">
                        Showing {filteredReports.length} reports
                    </div>
                </div>
            </div>

            {previewPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/90 backdrop-blur-sm">
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
                        <button
                            className="absolute -top-12 right-0 btn btn-ghost text-white hover:bg-white/20 p-2"
                            onClick={() => setPreviewPhoto(null)}
                        >
                            <X size={28} />
                        </button>
                        <img
                            src={previewPhoto}
                            alt="Work Progress"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl bg-black"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Send, FileCheck, CheckCircle2, Building2 } from 'lucide-react';
import { useStore } from '../store';

export default function SubmitReport() {
    const { currentUser, sites, addReport } = useStore();
    const navigate = useNavigate();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [workersCount, setWorkersCount] = useState<number | ''>('');
    const [workDescription, setWorkDescription] = useState('');
    const [materialsUsed, setMaterialsUsed] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const site = sites.find(s => s.id === currentUser?.assignedSiteId);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !site) return;

        setIsSubmitting(true);

        // Simulate network latency for a realistic feel
        setTimeout(() => {
            addReport({
                siteId: site.id,
                siteName: site.name,
                supervisorId: currentUser.id,
                supervisorName: currentUser.name,
                date,
                workersCount: Number(workersCount),
                workDescription,
                materialsUsed,
                photoUrl: photoPreview || undefined
            });

            setIsSubmitting(false);
            setShowSuccess(true);

            setTimeout(() => {
                navigate('/');
            }, 2000);
        }, 800);
    };

    if (!site) {
        return (
            <div className="card text-center p-8">
                <FileCheck size={48} className="mx-auto text-warning-500 mb-4" />
                <h2 className="text-xl font-bold">No Assigned Site</h2>
                <p className="text-muted mt-2">You don't have an assigned construction site. Contact your administrator.</p>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="card max-w-lg mx-auto p-12 text-center shadow-lg border-t-4" style={{ borderTopColor: 'var(--success-500)' }}>
                <CheckCircle2 size={64} className="mx-auto text-success-500 mb-6" />
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">Report Submitted!</h2>
                <p className="text-secondary-500 text-lg">Your daily work update for {site.name} has been saved successfully.</p>
                <div className="mt-8 text-sm text-secondary-400">Redirecting to dashboard...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Submit Daily Work Update</h1>
                    <p className="text-muted">Fill out the details below to report today's progress.</p>
                </div>
            </div>

            <div className="card shadow-md">
                <form onSubmit={handleSubmit} className="card-body p-6 space-y-6">
                    <div className="p-4 bg-primary-50 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-primary-700 uppercase">Assigned Site</p>
                            <h3 className="text-lg font-bold text-secondary-900 mb-1">{site.name}</h3>
                            <p className="text-sm text-secondary-600">{site.location}</p>
                        </div>
                        <Building2 size={32} className="text-primary-300" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-group mb-0">
                            <label className="form-label" htmlFor="date">Date</label>
                            <input
                                id="date"
                                type="date"
                                required
                                className="input"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" htmlFor="workers">Number of Workers</label>
                            <input
                                id="workers"
                                type="number"
                                required
                                min="0"
                                className="input"
                                placeholder="e.g. 25"
                                value={workersCount}
                                onChange={e => setWorkersCount(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="workDesc">Work Description</label>
                        <textarea
                            id="workDesc"
                            required
                            rows={4}
                            className="textarea"
                            placeholder="What tasks were completed today?"
                            value={workDescription}
                            onChange={e => setWorkDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="materials">Materials Used</label>
                        <textarea
                            id="materials"
                            required
                            rows={3}
                            className="textarea"
                            placeholder="Enter quantities of materials (e.g. 50 bags cement, 2 tons steel)"
                            value={materialsUsed}
                            onChange={e => setMaterialsUsed(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label">Work Progress Photo (Optional)</label>

                        {!photoPreview ? (
                            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 flex flex-col items-center justify-center bg-secondary-50 hover:bg-secondary-100 transition relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handlePhotoUpload}
                                />
                                <Camera size={32} className="text-secondary-400 mb-2" />
                                <p className="font-medium text-secondary-700">Tap to take photo</p>
                                <p className="text-sm text-secondary-500">or select from gallery</p>
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-secondary-200">
                                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 btn btn-danger btn-sm shadow"
                                    onClick={() => setPhotoPreview(null)}
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="pt-4 border-t border-secondary-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full sm:w-auto btn-lg shadow-md"
                        >
                            <Send size={20} />
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

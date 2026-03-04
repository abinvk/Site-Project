import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogIn } from 'lucide-react';
import { useStore } from '../store';

export default function Login() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const login = useStore(state => state.login);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (login(username)) {
            navigate('/');
        } else {
            setError('Invalid username. Try: admin, manager, sam, john');
        }
    };

    return (
        <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4">
            <div className="card w-full max-w-md">
                <div className="card-header justify-center flex-col gap-2 py-8 bg-primary">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary mb-2 shadow-lg">
                        <Building2 size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-0 text-center">SiteTrack</h1>
                    <p className="text-primary-100 text-sm">Construction Work Reporting System</p>
                </div>

                <form onSubmit={handleLogin} className="card-body p-8">
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className={`input ${error ? 'input-error' : ''}`}
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            required
                        />
                        {error && <p className="text-danger-500 text-xs mt-1">{error}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4 btn-lg">
                        <LogIn size={20} />
                        Sign In
                    </button>

                    <div className="mt-8 pt-6 border-t border-secondary-200 text-sm text-secondary-500">
                        <p className="font-semibold mb-2">Demo Accounts:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>admin</strong> (Admin access)</li>
                            <li><strong>manager</strong> (Manager access)</li>
                            <li><strong>sam</strong> (Supervisor at Downtown Skyscraper)</li>
                            <li><strong>john</strong> (Supervisor at Riverside Mall)</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
}

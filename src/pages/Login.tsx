import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogIn, HardHat, ShieldCheck, Clock } from 'lucide-react';
import { useStore } from '../store';
import './Login.css';

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

    const setDemoUser = (user: string) => {
        setUsername(user);
        if (login(user)) {
            navigate('/');
        }
    };

    return (
        <div className="login-container">
            {/* Left Promotional Side (Hidden on Mobile) */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="login-brand">
                        <Building2 size={32} />
                        SiteTrack
                    </div>

                    <h1 className="login-quote">
                        Build smarter,<br />
                        <span>track effortlessly.</span>
                    </h1>

                    <p className="login-description">
                        The next-generation construction management platform combining powerful insights with dead-simple mobile reporting for site supervisors.
                    </p>

                    <div className="login-features">
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <HardHat size={24} />
                            </div>
                            <div className="login-feature-text">
                                <h4>Built for the Field</h4>
                                <p>Designed with large touch targets and offline-first capabilities.</p>
                            </div>
                        </div>

                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <Clock size={24} />
                            </div>
                            <div className="login-feature-text">
                                <h4>Real-time Updates</h4>
                                <p>Instant synchronization between site workers and management.</p>
                            </div>
                        </div>

                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="login-feature-text">
                                <h4>Secure & Searchable</h4>
                                <p>All your work history safely backed up and instantly searchable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Login Form Side */}
            <div className="login-right">
                <div className="login-form-wrapper">

                    <div className="login-mobile-brand">
                        <Building2 size={28} />
                        SiteTrack
                    </div>

                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="card-body p-0">
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
                            {error && (
                                <p className="text-danger-500 text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                        >
                            <LogIn size={20} />
                            Sign In
                        </button>
                    </form>

                    {/* Quick Demo Login */}
                    <div className="demo-credentials">
                        <h3>Quick Login Demo</h3>
                        <div className="demo-buttons">
                            <button type="button" onClick={() => setDemoUser('admin')} className="demo-btn">
                                <div className="demo-dot admin"></div> Admin
                            </button>
                            <button type="button" onClick={() => setDemoUser('manager')} className="demo-btn">
                                <div className="demo-dot manager"></div> Manager
                            </button>
                            <button type="button" onClick={() => setDemoUser('sam')} className="demo-btn">
                                <div className="demo-dot supervisor"></div> Supervisor 1
                            </button>
                            <button type="button" onClick={() => setDemoUser('john')} className="demo-btn">
                                <div className="demo-dot supervisor"></div> Supervisor 2
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
    Building2,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    PlusCircle,
    Users,
    X
} from 'lucide-react';
import { useStore } from './store';

export default function Layout() {
    const { currentUser, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'manager'] },
        { name: 'Sites', path: '/sites', icon: <Building2 size={20} />, roles: ['admin', 'manager'] },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} />, roles: ['admin', 'manager', 'supervisor'] },
        { name: 'Submit Report', path: '/submit', icon: <PlusCircle size={20} />, roles: ['supervisor'] },
        { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['admin'] },
    ];

    const allowedNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="app-container">
            {/* Sidebar Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Building2 size={28} className="text-primary" />
                    <span>SiteTrack</span>
                    <button
                        className="md:hidden ml-auto btn btn-ghost p-1"
                        onClick={closeSidebar}
                        style={{ color: 'white' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {allowedNavItems.map(item => (
                        <button
                            key={item.path}
                            className={`nav-item w-full text-left ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => {
                                navigate(item.path);
                                closeSidebar();
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t" style={{ borderColor: 'var(--secondary-800)' }}>
                    <div className="flex items-center gap-3 mb-4 text-white">
                        <div className="avatar">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-sm">{currentUser.name}</div>
                            <div className="text-xs text-secondary-400 capitalize">{currentUser.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost w-full justify-center text-secondary-300 hover:text-white"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden btn btn-ghost p-1" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold md:hidden">SiteTrack</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium hidden sm:block">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="avatar avatar-sm ml-2 md:hidden">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

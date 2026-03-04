import { create } from 'zustand';
import { User, Site, WorkReport } from './types';

// Mock Data
const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', username: 'admin', role: 'admin' },
    { id: '2', name: 'Manager Mike', username: 'manager', role: 'manager' },
    { id: '3', name: 'Supervisor Sam', username: 'sam', role: 'supervisor', assignedSiteId: 's1' },
    { id: '4', name: 'Supervisor John', username: 'john', role: 'supervisor', assignedSiteId: 's2' },
];

const MOCK_SITES: Site[] = [
    { id: 's1', name: 'Downtown Skyscraper', location: '100 Main St', status: 'active', startDate: '2023-01-10', supervisorName: 'Supervisor Sam' },
    { id: 's2', name: 'Riverside Mall', location: '400 River Rd', status: 'active', startDate: '2023-05-20', supervisorName: 'Supervisor John' },
    { id: 's3', name: 'Tech Park Campus', location: 'Innovation Blvd', status: 'on_hold', startDate: '2022-11-05' },
];

const generateMockReports = (): WorkReport[] => {
    const reports: WorkReport[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Downtown Skyscraper reports
        reports.push({
            id: `r1-${i}`,
            siteId: 's1',
            siteName: 'Downtown Skyscraper',
            supervisorId: '3',
            supervisorName: 'Supervisor Sam',
            date: dateStr,
            workersCount: Math.floor(Math.random() * 20) + 50,
            workDescription: `Poured concrete for floor ${i % 10 + 1}. Installed reinforcing steel beams. Completed safety inspection.`,
            materialsUsed: '200 bags cement, 50 tons steel, timber',
            timestamp: new Date(d.setHours(17, 30)).toISOString(),
            photoUrl: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800'
        });

        // Riverside Mall reports
        if (i % 2 === 0) {
            reports.push({
                id: `r2-${i}`,
                siteId: 's2',
                siteName: 'Riverside Mall',
                supervisorId: '4',
                supervisorName: 'Supervisor John',
                date: dateStr,
                workersCount: Math.floor(Math.random() * 10) + 20,
                workDescription: 'Framing commercial spaces. Laying tiles in common areas.',
                materialsUsed: 'Drywall, Tiles, Plaster',
                timestamp: new Date(d.setHours(16, 45)).toISOString(),
            });
        }
    }
    return reports;
};

interface AppState {
    currentUser: User | null;
    users: User[];
    sites: Site[];
    reports: WorkReport[];

    // Actions
    login: (username: string) => boolean;
    logout: () => void;
    addReport: (report: Omit<WorkReport, 'id' | 'timestamp'>) => void;
    addSite: (site: Omit<Site, 'id'>) => void;
    addUser: (user: Omit<User, 'id'>) => void;
}

export const useStore = create<AppState>((set, get) => ({
    currentUser: null,
    users: MOCK_USERS,
    sites: MOCK_SITES,
    reports: generateMockReports(),

    login: (username) => {
        const user = get().users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (user) {
            set({ currentUser: user });
            return true;
        }
        return false;
    },

    logout: () => set({ currentUser: null }),

    addReport: (report) => {
        const newReport: WorkReport = {
            ...report,
            id: `r-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };
        set(state => ({ reports: [newReport, ...state.reports] }));
    },

    addSite: (site) => {
        const newSite: Site = {
            ...site,
            id: `s-${Date.now()}`
        };
        set(state => ({ sites: [...state.sites, newSite] }));
    },

    addUser: (user) => {
        const newUser: User = {
            ...user,
            id: `u-${Date.now()}`
        };
        set(state => ({ users: [...state.users, newUser] }));
    }
}));

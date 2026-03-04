export type Role = 'admin' | 'supervisor' | 'manager';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  assignedSiteId?: string; // For supervisors
}

export interface Site {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'completed' | 'on_hold';
  startDate: string;
  supervisorName?: string;
}

export interface WorkReport {
  id: string;
  siteId: string;
  siteName: string;
  supervisorId: string;
  supervisorName: string;
  date: string;
  workersCount: number;
  workDescription: string;
  materialsUsed: string;
  photoUrl?: string; // Optional photo
  timestamp: string;
}

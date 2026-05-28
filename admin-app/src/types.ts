export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarBg: string;
  role: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  submissionsCount: number;
}

export interface Submission {
  id: string;
  memberName: string;
  memberAvatar: string;
  avatarBg: string;
  title: string;
  type: string; // e.g. "UI Kit Template", "Social Media Guide", "Notion Template Pack"
  status: 'pending' | 'approved' | 'declined';
  submittedAt: string;
  revenue: number;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  reward?: number;
  file?: string;
}

export interface Payment {
  id: string;
  memberName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  item: string;
}

export interface DashboardStats {
  totalMembers: number;
  totalMembersChange: number;
  activeTasks: number;
  activeTasksChange: number;
  pendingReviews: number;
  pendingReviewsChange: number;
  monthlyRevenue: number;
  monthlyRevenueChange: number;
}

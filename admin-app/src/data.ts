import { Member, Submission, Task, Payment } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatar: 'AJ',
    avatarBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    role: 'Product Designer',
    status: 'active',
    joinedDate: '2026-03-12',
    submissionsCount: 4
  },
  {
    id: 'm-2',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    avatar: 'MG',
    avatarBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    role: 'Content Creator',
    status: 'active',
    joinedDate: '2026-01-20',
    submissionsCount: 8
  },
  {
    id: 'm-3',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: 'EW',
    avatarBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    role: 'Template Architect',
    status: 'active',
    joinedDate: '2026-04-05',
    submissionsCount: 3
  },
  {
    id: 'm-4',
    name: 'Liam Neeson',
    email: 'liam@example.com',
    avatar: 'LN',
    avatarBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/30',
    role: 'UI Developer',
    status: 'active',
    joinedDate: '2026-02-15',
    submissionsCount: 12
  },
  {
    id: 'm-5',
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    avatar: 'SM',
    avatarBg: 'bg-rose-500/10 text-rose-400 border-rose-400/30',
    role: 'Copywriter',
    status: 'active',
    joinedDate: '2026-05-01',
    submissionsCount: 2
  },
  {
    id: 'm-6',
    name: 'Daniel Kim',
    email: 'dan.k@example.com',
    avatar: 'DK',
    avatarBg: 'bg-purple-500/10 text-purple-400 border-purple-400/30',
    role: 'No-Code Expert',
    status: 'inactive',
    joinedDate: '2025-12-10',
    submissionsCount: 6
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    memberName: 'Alex Johnson',
    memberAvatar: 'AJ',
    avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: 'UI Kit Template',
    type: 'UI Kit Template',
    status: 'pending',
    submittedAt: 'Today, 08:15 AM',
    revenue: 450,
    description: 'A dark-themed comprehensive React & Tailwind CSS dashboard components library.'
  },
  {
    id: 'sub-2',
    memberName: 'Maria Garcia',
    memberAvatar: 'MG',
    avatarBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    title: 'Social Media Guide',
    type: 'Social Media Guide',
    status: 'pending',
    submittedAt: 'Today, 07:30 AM',
    revenue: 320,
    description: 'Complete playbook with templates, schedulers, and metrics calculators.'
  },
  {
    id: 'sub-3',
    memberName: 'Emma Wilson',
    memberAvatar: 'EW',
    avatarBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: 'Notion Template Pack',
    type: 'Notion Template Pack',
    status: 'pending',
    submittedAt: 'Yesterday, 04:45 PM',
    revenue: 180,
    description: 'All-in-one workspaces planner for freelance devs and design agencies.'
  },
  {
    id: 'sub-4',
    memberName: 'Liam Neeson',
    memberAvatar: 'LN',
    avatarBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30',
    title: 'SaaS SaaS Landing Page',
    type: 'HTML Template',
    status: 'approved',
    submittedAt: '2026-05-20',
    revenue: 1250,
    description: 'Fully responsive minimalist landing page with Tailwind CSS v4.'
  },
  {
    id: 'sub-5',
    memberName: 'Sophia Martinez',
    memberAvatar: 'SM',
    avatarBg: 'bg-rose-500/20 text-rose-400 border-rose-400/30',
    title: 'SEO Checklist Playbook',
    type: 'E-Book PDF',
    status: 'approved',
    submittedAt: '2026-05-18',
    revenue: 750,
    description: 'An exhaustive search optimization guide to scaling software blogs.'
  },
  {
    id: 'sub-6',
    memberName: 'Daniel Kim',
    memberAvatar: 'DK',
    avatarBg: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    title: 'Figma Landing Page Bundle',
    type: 'Figma File',
    status: 'declined',
    submittedAt: '2026-05-15',
    revenue: 600,
    description: 'Low contrast design elements failing general accessibility design principles.'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Refactor Auth middleware',
    description: 'Clean up token storage cookies and transition fully to httponly protocols.',
    category: 'Development',
    assignedTo: 'Daniel Kim',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-05-30'
  },
  {
    id: 'task-2',
    title: 'Audit visual accessibility contrast ratio',
    description: 'Audit standard colors in primary dark templates to match WCAG AAA specifications.',
    category: 'Design Audit',
    assignedTo: 'Alex Johnson',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-06-02'
  },
  {
    id: 'task-3',
    title: 'Configure monthly financial exports',
    description: 'Format payout columns inside automated Google Sheets templates for active Stripe accounts.',
    category: 'Finance',
    assignedTo: 'Maria Garcia',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-05-20'
  },
  {
    id: 'task-4',
    title: 'Draft summer campaign email templates',
    description: 'Create promotional layouts featuring template bundles with high CTR headers.',
    category: 'Marketing',
    assignedTo: 'Sophia Martinez',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-05-28'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    memberName: 'Sophia Martinez',
    amount: 750,
    status: 'success',
    date: '2026-05-24',
    item: 'SEO Checklist Playbook'
  },
  {
    id: 'pay-2',
    memberName: 'Liam Neeson',
    amount: 1250,
    status: 'success',
    date: '2026-05-23',
    item: 'SaaS Landing Page'
  },
  {
    id: 'pay-3',
    memberName: 'Alex Johnson',
    amount: 450,
    status: 'pending',
    date: '2026-05-24',
    item: 'UI Kit Template'
  },
  {
    id: 'pay-4',
    memberName: 'Gary Oldman',
    amount: 99,
    status: 'failed',
    date: '2026-05-22',
    item: 'Basic Support Subscription'
  }
];

export const INI_REVENUE_CHART_DATA = [
  { date: 'May 18', revenue: 8400, members: 490 },
  { date: 'May 19', revenue: 9200, members: 495 },
  { date: 'May 20', revenue: 10450, members: 502 },
  { date: 'May 21', revenue: 11100, members: 508 },
  { date: 'May 22', revenue: 11950, members: 516 },
  { date: 'May 23', revenue: 12200, members: 520 },
  { date: 'May 24', revenue: 12450, members: 524 }
];

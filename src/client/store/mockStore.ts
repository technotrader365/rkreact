
import { Course, Nudge, StudentRiskProfile, User, CalendarEvent, Assessment, StudentProfileFull } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex.rivera@snapx.edu',
  role: 'student',
  avatar: 'AR'
};

export const mockTeacher: User = {
  id: 't1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@snapx.edu',
  role: 'admin', // Changed to admin as requested
  avatar: 'SC'
};

export const mockRiskProfile: StudentRiskProfile = {
  overallRisk: 'Medium',
  attendanceScore: 82,
  submissionRate: 90,
  engagementTrend: 'down'
};

// Helper to get dates relative to today for dynamic mock data
const getRelativeDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Advanced Data Structures Midterm',
    date: getRelativeDate(2),
    type: 'exam',
    courseId: 'c1',
    duration: '2h',
    description: 'Covers trees, graphs, and hashmaps.'
  },
  {
    id: 'e2',
    title: 'UX Case Study Submission',
    date: getRelativeDate(5),
    type: 'deadline',
    courseId: 'c2',
    description: 'Final PDF submission via portal.'
  },
  {
    id: 'e3',
    title: 'Group Study: React Hooks',
    date: getRelativeDate(-1),
    type: 'study',
    courseId: 'c4',
    duration: '1.5h'
  },
  {
    id: 'e4',
    title: 'Hackathon Kickoff',
    date: getRelativeDate(8),
    type: 'social',
    duration: '4h'
  },
  {
    id: 'e5',
    title: 'Marketing Plan Draft',
    date: getRelativeDate(12),
    type: 'deadline',
    courseId: 'c5'
  },
  {
    id: 'e6',
    title: 'Cloud Systems Quiz',
    date: getRelativeDate(15),
    type: 'exam',
    courseId: 'c6'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Advanced Data Structures',
    instructor: 'Dr. Sarah Chen',
    progress: 65,
    totalModules: 12,
    completedModules: 8,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    category: 'Computer Science',
    nextLesson: 'Graph Traversal Algorithms',
    enrolled: true,
    description: 'Master trees, graphs, and hash tables with advanced algorithmic analysis and optimization techniques.',
    skills: ['Algorithms', 'C++', 'Graph Theory'],
    rating: 4.9,
    studentsEnrolled: 1240
  },
  {
    id: 'c2',
    title: 'UX/UI Design Systems',
    instructor: 'Prof. Marcus O',
    progress: 10,
    totalModules: 8,
    completedModules: 1,
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&q=80',
    category: 'Design',
    nextLesson: 'Atomic Design Principles',
    enrolled: true,
    description: 'Learn to build scalable design systems, manage component libraries, and ensure consistency across digital products.',
    skills: ['Figma', 'Design Tokens', 'Accessibility'],
    rating: 4.7,
    studentsEnrolled: 850
  },
  {
    id: 'c3',
    title: 'AI Ethics & Compliance',
    instructor: 'Dr. A. Turing',
    progress: 0,
    totalModules: 5,
    completedModules: 0,
    thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    category: 'Humanities',
    nextLesson: 'Introduction to Bias',
    enrolled: true,
    description: 'Explore the moral implications of Artificial Intelligence, focusing on bias, fairness, and regulatory compliance.',
    skills: ['Ethics', 'Policy', 'Critical Thinking'],
    rating: 4.8,
    studentsEnrolled: 2100
  },
  {
    id: 'c4',
    title: 'Modern React Patterns',
    instructor: 'Dan A.',
    progress: 0,
    totalModules: 10,
    completedModules: 0,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    category: 'Computer Science',
    nextLesson: 'Hooks Deep Dive',
    enrolled: false,
    recommended: true,
    description: 'A comprehensive guide to modern React development, including Hooks, Context, and performance optimization.',
    skills: ['React', 'TypeScript', 'State Management'],
    rating: 4.9,
    studentsEnrolled: 3400
  },
  {
    id: 'c5',
    title: 'Digital Marketing 101',
    instructor: 'Sarah J.',
    progress: 0,
    totalModules: 6,
    completedModules: 0,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    category: 'Business',
    nextLesson: 'SEO Fundamentals',
    enrolled: false,
    recommended: true,
    description: 'Understand the core pillars of digital marketing: SEO, SEM, Content Strategy, and Social Media Analytics.',
    skills: ['SEO', 'Analytics', 'Content Strategy'],
    rating: 4.6,
    studentsEnrolled: 1500
  },
  {
    id: 'c6',
    title: 'Cloud Architecture Basics',
    instructor: 'Jeff B.',
    progress: 0,
    totalModules: 8,
    completedModules: 0,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    category: 'Computer Science',
    nextLesson: 'AWS Core Services',
    enrolled: false,
    recommended: true,
    description: 'Learn the fundamentals of designing scalable and reliable systems on major cloud platforms.',
    skills: ['AWS', 'System Design', 'DevOps'],
    rating: 4.8,
    studentsEnrolled: 980
  },
  {
    id: 'c7',
    title: 'Financial Literacy',
    instructor: 'Warren B.',
    progress: 0,
    totalModules: 4,
    completedModules: 0,
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    category: 'Business',
    nextLesson: 'Budgeting 101',
    enrolled: false,
    description: 'Essential personal finance skills for students, covering budgeting, saving, and basic investing.',
    skills: ['Budgeting', 'Investing', 'Planning'],
    rating: 4.9,
    studentsEnrolled: 5200
  }
];

export const mockNudges: Nudge[] = [
  {
    id: 'n1',
    type: 'Risk',
    severity: 'high',
    message: 'We noticed a drop in your attendance for CS301. Early intervention is key to passing.',
    timestamp: '2 hours ago',
    actionLabel: 'Contact Tutor',
    actionLink: '/engagement'
  },
  {
    id: 'n2',
    type: 'Compliance',
    severity: 'medium',
    message: 'Your study-from-home environment audit is pending renewal.',
    timestamp: '1 day ago',
    actionLabel: 'Upload Photo',
    actionLink: '/compliance'
  },
  {
    id: 'n3',
    type: 'Opportunity',
    severity: 'low',
    message: 'New internship matched: Frontend Dev at Google based on your React grades.',
    timestamp: '3 days ago',
    actionLabel: 'View Career Path',
    actionLink: '/career'
  }
];

export const mockAssessments: Assessment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    title: 'Midterm Algorithm Analysis',
    dueDate: '2025-05-15',
    totalPoints: 100,
    avgScore: 78,
    status: 'Published',
    questions: 20
  },
  {
    id: 'a2',
    courseId: 'c1',
    title: 'Graph Theory Quiz',
    dueDate: '2025-05-20',
    totalPoints: 50,
    avgScore: 0,
    status: 'Draft',
    questions: 10
  },
  {
    id: 'a3',
    courseId: 'c2',
    title: 'Figma Component Systems',
    dueDate: '2025-05-18',
    totalPoints: 100,
    avgScore: 92,
    status: 'Graded',
    questions: 5
  }
];

export const mockStudentsList: StudentProfileFull[] = [
  {
    id: 's1',
    name: 'Alex Rivera',
    email: 'alex.rivera@snapx.edu',
    avatar: 'AR',
    gpa: 3.2,
    attendance: 82,
    missedDeadlines: 2,
    strongestSkill: 'React',
    weakestSkill: 'Database',
    recentGrades: [85, 90, 72, 65]
  },
  {
    id: 's2',
    name: 'Jordan Lee',
    email: 'jordan.lee@snapx.edu',
    avatar: 'JL',
    gpa: 3.9,
    attendance: 98,
    missedDeadlines: 0,
    strongestSkill: 'Algorithms',
    weakestSkill: 'UI Design',
    recentGrades: [98, 95, 92, 100]
  },
  {
    id: 's3',
    name: 'Casey Smith',
    email: 'casey.smith@snapx.edu',
    avatar: 'CS',
    gpa: 2.1,
    attendance: 60,
    missedDeadlines: 5,
    strongestSkill: 'Communication',
    weakestSkill: 'Coding',
    recentGrades: [50, 45, 60, 55]
  }
];

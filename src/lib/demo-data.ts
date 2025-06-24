import { 
  User, StudentProfile, CorporateProfile, Course, Badge, SkillNode, 
  Employee, Internship, FlashcardSet, Quiz, Question, PhishingCampaign,
  SecurityThreat, LearningAnalytics, SecurityAnalytics 
} from './types';

// Demo Users
export const demoUsers: User[] = [
  {
    id: 'student-1',
    email: 'student@demo.com',
    name: 'Alex Chen',
    role: 'student',
    avatar: '/avatars/student.jpg',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'teacher-1',
    email: 'teacher@demo.com',
    name: 'Sarah Johnson',
    role: 'teacher',
    avatar: '/avatars/teacher.jpg',
    createdAt: new Date('2023-08-10'),
  },
  {
    id: 'corporate-1',
    email: 'corporate@demo.com',
    name: 'Michael Rodriguez',
    role: 'corporate',
    avatar: '/avatars/corporate.jpg',
    createdAt: new Date('2023-05-20'),
  },
];

// Demo Badges
export const demoBadges: Badge[] = [
  {
    id: 'password-ninja',
    name: 'Password Ninja',
    description: 'Master of strong password creation',
    icon: '🥷',
    rarity: 'rare',
    earnedAt: new Date('2024-05-15'),
  },
  {
    id: 'phishing-spotter',
    name: 'Phishing Spotter',
    description: 'Detected 50 phishing attempts',
    icon: '🎣',
    rarity: 'epic',
    earnedAt: new Date('2024-06-01'),
  },
  {
    id: 'crypto-guardian',
    name: 'Crypto Guardian',
    description: 'Encryption expert',
    icon: '🔐',
    rarity: 'legendary',
  },
  {
    id: 'network-defender',
    name: 'Network Defender',
    description: 'Completed network security course',
    icon: '🛡️',
    rarity: 'common',
    earnedAt: new Date('2024-04-20'),
  },
];

// Demo Skill Tree
export const demoSkillTree: SkillNode[] = [
  {
    id: 'basics',
    name: 'Cybersecurity Basics',
    description: 'Foundation of cybersecurity knowledge',
    unlocked: true,
    mastered: true,
    prerequisites: [],
    xpRequired: 0,
    icon: '🔰',
  },
  {
    id: 'passwords',
    name: 'Password Security',
    description: 'Creating and managing secure passwords',
    unlocked: true,
    mastered: true,
    prerequisites: ['basics'],
    xpRequired: 100,
    icon: '🔑',
  },
  {
    id: 'phishing',
    name: 'Phishing Defense',
    description: 'Identifying and avoiding phishing attacks',
    unlocked: true,
    mastered: false,
    prerequisites: ['basics'],
    xpRequired: 150,
    icon: '🎣',
  },
  {
    id: 'networks',
    name: 'Network Security',
    description: 'Understanding network protocols and security',
    unlocked: true,
    mastered: false,
    prerequisites: ['passwords'],
    xpRequired: 300,
    icon: '🌐',
  },
  {
    id: 'encryption',
    name: 'Cryptography',
    description: 'Encryption and decryption techniques',
    unlocked: false,
    mastered: false,
    prerequisites: ['networks', 'phishing'],
    xpRequired: 500,
    icon: '🔐',
  },
];

// Demo Courses
export const demoCourses: Course[] = [
  // Elementary Courses
  {
    id: 'course-1',
    title: 'What is the Internet?',
    description: 'Basic introduction to how the internet works and stays safe online',
    grade: 'Elementary (5th-6th)',
    difficulty: 'beginner',
    duration: 45,
    rating: 4.8,
    progress: 100,
    thumbnail: '/courses/internet-basics.jpg',
    instructor: 'Ms. Wilson',
    tags: ['basics', 'internet', 'safety'],
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'How the Internet Works',
        content: 'Understanding the basics of internet connectivity',
        type: 'video',
        duration: 15,
        completed: true,
      },
      {
        id: 'lesson-1-2',
        title: 'Staying Safe Online',
        content: 'Basic safety rules for internet use',
        type: 'interactive',
        duration: 20,
        completed: true,
      },
      {
        id: 'lesson-1-3',
        title: 'Knowledge Check',
        content: 'Test your understanding',
        type: 'quiz',
        duration: 10,
        completed: true,
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Password Power',
    description: 'Learn to create super strong passwords that keep your accounts safe',
    grade: 'Elementary (5th-6th)',
    difficulty: 'beginner',
    duration: 30,
    rating: 4.9,
    progress: 75,
    thumbnail: '/courses/password-power.jpg',
    instructor: 'Mr. Davis',
    tags: ['passwords', 'authentication', 'security'],
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'What Makes a Strong Password',
        content: 'Characteristics of secure passwords',
        type: 'video',
        duration: 12,
        completed: true,
      },
      {
        id: 'lesson-2-2',
        title: 'Password Creation Game',
        content: 'Interactive password building exercise',
        type: 'interactive',
        duration: 15,
        completed: true,
      },
      {
        id: 'lesson-2-3',
        title: 'Password Managers',
        content: 'How to use password managers safely',
        type: 'video',
        duration: 8,
        completed: false,
      },
    ],
  },

  // High School Courses
  {
    id: 'course-3',
    title: 'Network Fundamentals',
    description: 'Understanding computer networks and their security implications',
    grade: 'High School (9th-12th)',
    difficulty: 'intermediate',
    duration: 120,
    rating: 4.7,
    progress: 60,
    thumbnail: '/courses/network-fundamentals.jpg',
    instructor: 'Dr. Martinez',
    tags: ['networking', 'protocols', 'security'],
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'OSI Model Overview',
        content: 'Understanding the seven layers of networking',
        type: 'video',
        duration: 25,
        completed: true,
      },
      {
        id: 'lesson-3-2',
        title: 'TCP/IP Protocol Suite',
        content: 'Deep dive into internet protocols',
        type: 'text',
        duration: 30,
        completed: true,
      },
      {
        id: 'lesson-3-3',
        title: 'Network Security Basics',
        content: 'Firewalls, VPNs, and secure communication',
        type: 'video',
        duration: 35,
        completed: false,
      },
    ],
  },

  // College/Adult Courses
  {
    id: 'course-4',
    title: 'SOC Analyst Essentials',
    description: 'Complete guide to becoming a Security Operations Center analyst',
    grade: 'College/Adult',
    difficulty: 'advanced',
    duration: 240,
    rating: 4.9,
    progress: 25,
    thumbnail: '/courses/soc-analyst.jpg',
    instructor: 'Jennifer Wang',
    tags: ['soc', 'monitoring', 'incident-response'],
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'SOC Environment Overview',
        content: 'Understanding the role of a SOC analyst',
        type: 'video',
        duration: 40,
        completed: true,
      },
      {
        id: 'lesson-4-2',
        title: 'SIEM Tools and Techniques',
        content: 'Working with security information and event management systems',
        type: 'interactive',
        duration: 60,
        completed: false,
      },
    ],
  },
];

// Demo Student Profile
export const demoStudent: StudentProfile = {
  ...demoUsers[0],
  role: 'student',
  grade: 'High School (11th)',
  level: 7,
  xp: 2480,
  streak: 7,
  badges: demoBadges.filter(b => b.earnedAt),
  courses: demoCourses,
  skillTree: demoSkillTree,
};

// Demo Employees
export const demoEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    department: 'Engineering',
    riskScore: 25,
    trainingCompleted: 95,
    lastPhishingTest: new Date('2024-06-15'),
    phishingFailures: 0,
    passwordScore: 90,
  },
  {
    id: 'emp-2',
    name: 'Emily Johnson',
    email: 'emily.j@techcorp.com',
    department: 'Marketing',
    riskScore: 65,
    trainingCompleted: 60,
    lastPhishingTest: new Date('2024-06-10'),
    phishingFailures: 2,
    passwordScore: 45,
  },
  {
    id: 'emp-3',
    name: 'David Lee',
    email: 'david.lee@techcorp.com',
    department: 'Sales',
    riskScore: 80,
    trainingCompleted: 30,
    lastPhishingTest: new Date('2024-05-20'),
    phishingFailures: 3,
    passwordScore: 30,
  },
  {
    id: 'emp-4',
    name: 'Sarah Wilson',
    email: 'sarah.w@techcorp.com',
    department: 'HR',
    riskScore: 35,
    trainingCompleted: 85,
    lastPhishingTest: new Date('2024-06-12'),
    phishingFailures: 1,
    passwordScore: 75,
  },
  {
    id: 'emp-5',
    name: 'Michael Chen',
    email: 'michael.c@techcorp.com',
    department: 'Finance',
    riskScore: 20,
    trainingCompleted: 100,
    lastPhishingTest: new Date('2024-06-18'),
    phishingFailures: 0,
    passwordScore: 95,
  },
];

// Demo Corporate Profile
export const demoCorporate: CorporateProfile = {
  ...demoUsers[2],
  role: 'corporate',
  company: 'TechCorp Industries',
  department: 'IT Security',
  employees: demoEmployees,
  securityScore: 78,
};

// Demo Internships
export const demoInternships: Internship[] = [
  {
    id: 'intern-1',
    company: 'CyberDefense Inc.',
    title: 'Junior Security Analyst Intern',
    description: 'Work alongside experienced security analysts to monitor network traffic and investigate security incidents.',
    requirements: ['Basic networking knowledge', 'Familiarity with Linux', 'Security+ certification preferred'],
    location: 'San Francisco, CA',
    duration: '12 weeks',
    type: 'hybrid',
    skillsRequired: ['Network Security', 'Incident Response', 'SIEM Tools'],
    applicationDeadline: new Date('2024-08-15'),
    matchPercentage: 85,
  },
  {
    id: 'intern-2',
    company: 'SecureBank Solutions',
    title: 'Cybersecurity Intern',
    description: 'Support the cybersecurity team in vulnerability assessments and security awareness training.',
    requirements: ['Currently enrolled in cybersecurity program', 'Strong communication skills'],
    location: 'New York, NY',
    duration: '10 weeks',
    type: 'onsite',
    skillsRequired: ['Vulnerability Assessment', 'Risk Analysis', 'Security Awareness'],
    applicationDeadline: new Date('2024-07-30'),
    matchPercentage: 72,
  },
  {
    id: 'intern-3',
    company: 'CloudGuard Technologies',
    title: 'Cloud Security Intern',
    description: 'Learn about cloud security architecture and help implement security controls in AWS environments.',
    requirements: ['AWS fundamentals', 'Python programming', 'Cloud security interest'],
    location: 'Remote',
    duration: '16 weeks',
    type: 'remote',
    skillsRequired: ['Cloud Security', 'AWS', 'Python', 'DevSecOps'],
    applicationDeadline: new Date('2024-09-01'),
    matchPercentage: 68,
  },
];

// Demo Quiz Questions
export const demoQuizQuestions: Question[] = [
  {
    id: 'q1',
    question: 'What is the minimum recommended length for a strong password?',
    type: 'multiple-choice',
    options: ['6 characters', '8 characters', '12 characters', '16 characters'],
    correct: '12 characters',
    explanation: 'Security experts recommend passwords of at least 12 characters for adequate protection.',
    points: 10,
  },
  {
    id: 'q2',
    question: 'Phishing attacks always come through email.',
    type: 'true-false',
    correct: 'false',
    explanation: 'Phishing can occur through email, SMS, social media, phone calls, and other channels.',
    points: 5,
  },
  {
    id: 'q3',
    question: 'What does "HTTPS" stand for?',
    type: 'fill-blank',
    correct: 'HyperText Transfer Protocol Secure',
    explanation: 'HTTPS is the secure version of HTTP, encrypted with SSL/TLS.',
    points: 15,
  },
];

// Demo Quiz
export const demoQuiz: Quiz = {
  id: 'quiz-1',
  title: 'Cybersecurity Basics Assessment',
  description: 'Test your knowledge of fundamental cybersecurity concepts',
  questions: demoQuizQuestions,
  timeLimit: 600, // 10 minutes
  difficulty: 'easy',
  topic: 'Cybersecurity Fundamentals',
  points: 100,
};

// Demo Flashcard Set
export const demoFlashcardSet: FlashcardSet = {
  id: 'flashcard-1',
  title: 'Network Security Terms',
  description: 'Essential networking and security terminology',
  createdBy: 'student-1',
  createdAt: new Date('2024-06-01'),
  public: true,
  tags: ['networking', 'security', 'terminology'],
  cards: [
    {
      id: 'card-1',
      front: 'What is a firewall?',
      back: 'A network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.',
      difficulty: 'easy',
      tags: ['firewall', 'network'],
      correctCount: 8,
      totalCount: 10,
    },
    {
      id: 'card-2',
      front: 'Define VPN',
      back: 'Virtual Private Network - extends a private network across a public network, enabling secure communication.',
      difficulty: 'medium',
      tags: ['vpn', 'encryption'],
      correctCount: 6,
      totalCount: 8,
    },
    {
      id: 'card-3',
      front: 'What is DDoS?',
      back: 'Distributed Denial of Service - an attack that attempts to make a network resource unavailable by overwhelming it with traffic.',
      difficulty: 'medium',
      tags: ['ddos', 'attacks'],
      correctCount: 4,
      totalCount: 6,
    },
  ],
};

// Demo Learning Analytics
export const demoLearningAnalytics: LearningAnalytics = {
  totalTime: 1245, // minutes
  topicsStudied: 12,
  quizzesTaken: 28,
  averageScore: 87.5,
  streakDays: 7,
  weeklyProgress: [
    { day: 'Mon', xp: 150 },
    { day: 'Tue', xp: 200 },
    { day: 'Wed', xp: 180 },
    { day: 'Thu', xp: 220 },
    { day: 'Fri', xp: 175 },
    { day: 'Sat', xp: 160 },
    { day: 'Sun', xp: 140 },
  ],
};

// Demo Security Analytics
export const demoSecurityAnalytics: SecurityAnalytics = {
  securityScore: 78,
  vulnerabilities: 12,
  threatsDetected: 45,
  employeesAtRisk: 15,
  trainingCompletion: 74,
  monthlyTrends: [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 76 },
    { month: 'Jun', score: 78 },
  ],
};

// Demo Phishing Campaigns
export const demoPhishingCampaigns: PhishingCampaign[] = [
  {
    id: 'phish-1',
    name: 'CEO Fraud Test',
    template: 'Urgent: Please process this wire transfer immediately...',
    targets: ['emily.j@techcorp.com', 'david.lee@techcorp.com', 'sarah.w@techcorp.com'],
    sentAt: new Date('2024-06-15'),
    clickRate: 15.5,
    reportRate: 84.5,
    status: 'completed',
  },
  {
    id: 'phish-2',
    name: 'IT Support Scam',
    template: 'Your account has been compromised. Click here to secure it...',
    targets: ['john.smith@techcorp.com', 'michael.c@techcorp.com'],
    sentAt: new Date('2024-06-10'),
    clickRate: 8.2,
    reportRate: 91.8,
    status: 'completed',
  },
];

// Demo Security Threats
export const demoSecurityThreats: SecurityThreat[] = [
  {
    id: 'threat-1',
    type: 'Malware Detection',
    severity: 'high',
    description: 'Suspicious file detected on workstation in Marketing department',
    affectedEmployees: ['emily.j@techcorp.com'],
    resolved: false,
    detectedAt: new Date('2024-06-20'),
  },
  {
    id: 'threat-2',
    type: 'Unusual Login Activity',
    severity: 'medium',
    description: 'Multiple failed login attempts from foreign IP address',
    affectedEmployees: ['david.lee@techcorp.com'],
    resolved: true,
    detectedAt: new Date('2024-06-18'),
  },
  {
    id: 'threat-3',
    type: 'Data Exfiltration Attempt',
    severity: 'critical',
    description: 'Large file upload to external cloud service detected',
    affectedEmployees: ['sarah.w@techcorp.com', 'michael.c@techcorp.com'],
    resolved: false,
    detectedAt: new Date('2024-06-19'),
  },
];

// Demo Students for Teacher Dashboard
export const demoClassroomStudents = [
  {
    id: 'student-1',
    name: 'Alex Chen',
    email: 'alex.chen@school.edu',
    grade: '11th Grade',
    level: 7,
    xp: 2480,
    streak: 7,
    coursesEnrolled: 4,
    coursesCompleted: 2,
    averageScore: 92,
    lastActive: new Date('2024-06-20'),
    badges: ['Password Ninja', 'Phishing Spotter'],
    riskAreas: ['Social Engineering'],
    strongAreas: ['Network Security', 'Cryptography']
  },
  {
    id: 'student-2',
    name: 'Emma Rodriguez',
    email: 'emma.r@school.edu',
    grade: '10th Grade', 
    level: 5,
    xp: 1850,
    streak: 12,
    coursesEnrolled: 3,
    coursesCompleted: 1,
    averageScore: 88,
    lastActive: new Date('2024-06-21'),
    badges: ['Network Defender', 'Quiz Master'],
    riskAreas: ['Password Management'],
    strongAreas: ['Malware Detection', 'Safe Browsing']
  },
  {
    id: 'student-3',
    name: 'James Wilson',
    email: 'james.w@school.edu',
    grade: '12th Grade',
    level: 9,
    xp: 3200,
    streak: 5,
    coursesEnrolled: 5,
    coursesCompleted: 3,
    averageScore: 95,
    lastActive: new Date('2024-06-21'),
    badges: ['Crypto Guardian', 'Security Expert', 'Team Leader'],
    riskAreas: [],
    strongAreas: ['Advanced Cryptography', 'Incident Response', 'Penetration Testing']
  },
  {
    id: 'student-4',
    name: 'Sophie Kim',
    email: 'sophie.k@school.edu',
    grade: '9th Grade',
    level: 3,
    xp: 1200,
    streak: 3,
    coursesEnrolled: 2,
    coursesCompleted: 1,
    averageScore: 78,
    lastActive: new Date('2024-06-19'),
    badges: ['First Steps', 'Password Ninja'],
    riskAreas: ['Phishing Recognition', 'Social Media Safety'],
    strongAreas: ['Basic Security Principles']
  },
  {
    id: 'student-5',
    name: 'Marcus Thompson',
    email: 'marcus.t@school.edu',
    grade: '11th Grade',
    level: 6,
    xp: 2100,
    streak: 0,
    coursesEnrolled: 3,
    coursesCompleted: 1,
    averageScore: 73,
    lastActive: new Date('2024-06-15'),
    badges: ['Network Defender'],
    riskAreas: ['Mobile Security', 'Cloud Security'],
    strongAreas: ['Hardware Security']
  }
];

// Demo Assignments for Teacher
export const demoAssignments = [
  {
    id: 'assignment-1',
    title: 'Password Security Challenge',
    description: 'Create and analyze strong passwords using different techniques',
    course: 'Cybersecurity Fundamentals',
    dueDate: new Date('2024-06-25'),
    status: 'active',
    studentsAssigned: 25,
    studentsCompleted: 18,
    averageScore: 87,
    type: 'quiz'
  },
  {
    id: 'assignment-2', 
    title: 'Phishing Email Analysis',
    description: 'Identify phishing indicators in real email examples',
    course: 'Social Engineering Defense',
    dueDate: new Date('2024-06-28'),
    status: 'active',
    studentsAssigned: 22,
    studentsCompleted: 12,
    averageScore: 91,
    type: 'interactive'
  },
  {
    id: 'assignment-3',
    title: 'Network Security Fundamentals',
    description: 'Complete the network security module and quiz',
    course: 'Advanced Cybersecurity',
    dueDate: new Date('2024-07-02'),
    status: 'draft',
    studentsAssigned: 15,
    studentsCompleted: 0,
    averageScore: 0,
    type: 'course'
  }
];

// Demo Class Analytics for Teacher
export const demoClassAnalytics = {
  totalStudents: 28,
  activeStudents: 23,
  averageGrade: 85,
  coursesCompleted: 156,
  totalXPEarned: 45600,
  badgesEarned: 89,
  weeklyEngagement: [
    { day: 'Mon', students: 18, hours: 42 },
    { day: 'Tue', students: 22, hours: 55 },
    { day: 'Wed', students: 20, hours: 48 },
    { day: 'Thu', students: 25, hours: 67 },
    { day: 'Fri', students: 19, hours: 38 },
    { day: 'Sat', students: 8, hours: 15 },
    { day: 'Sun', students: 12, hours: 22 }
  ],
  gradeDistribution: [
    { grade: 'A', count: 8, percentage: 29 },
    { grade: 'B', count: 12, percentage: 43 },
    { grade: 'C', count: 6, percentage: 21 },
    { grade: 'D', count: 2, percentage: 7 },
    { grade: 'F', count: 0, percentage: 0 }
  ],
  topPerformers: [
    { name: 'James Wilson', score: 95, level: 9 },
    { name: 'Alex Chen', score: 92, level: 7 },
    { name: 'Emma Rodriguez', score: 88, level: 5 }
  ],
  strugglingStudents: [
    { name: 'Marcus Thompson', score: 73, lastActive: '6 days ago' },
    { name: 'Sophie Kim', score: 78, lastActive: '2 days ago' }
  ]
};

// Authentication helper
export const authenticateUser = (email: string, password: string): User | null => {
  if (password !== 'password123') return null;
  
  return demoUsers.find(user => user.email === email) || null;
};

// Get user profile based on role
export const getUserProfile = (userId: string) => {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return null;

  switch (user.role) {
    case 'student':
      return demoStudent;
    case 'corporate':
      return demoCorporate;
    default:
      return user;
  }
}; 
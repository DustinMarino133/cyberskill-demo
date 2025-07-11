// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'corporate';
  avatar?: string;
  createdAt: Date;
}

export interface StudentProfile extends User {
  grade: string;
  level: number;
  xp: number;
  streak: number;
  badges: Badge[];
  courses: Course[];
  skillTree: SkillNode[];
}

export interface CorporateProfile extends User {
  company: string;
  department: string;
  employees: Employee[];
  securityScore: number;
}

// Learning Content Types
export interface Course {
  id: string;
  title: string;
  description: string;
  grade: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  rating: number;
  progress: number;
  lessons: Lesson[];
  thumbnail: string;
  instructor: string;
  tags: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  duration: number;
  completed: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  lastReviewed?: Date;
  correctCount: number;
  totalCount: number;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdBy: string;
  createdAt: Date;
  public: boolean;
  tags: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
  createdBy?: string;
  createdAt?: Date;
  tags?: string[];
  passingScore?: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correct: string | string[];
  explanation: string;
  points: number;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  mastered: boolean;
  prerequisites: string[];
  xpRequired: number;
  icon: string;
}

// Corporate Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  trainingCompleted: number;
  lastPhishingTest?: Date;
  phishingFailures: number;
  passwordScore: number;
}

export interface PhishingCampaign {
  id: string;
  name: string;
  template: string;
  targets: string[];
  sentAt: Date;
  clickRate: number;
  reportRate: number;
  status: 'draft' | 'sent' | 'completed';
}

export interface SecurityThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedEmployees: string[];
  resolved: boolean;
  detectedAt: Date;
}

// Internship Types
export interface Internship {
  id: string;
  company: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  duration: string;
  type: 'remote' | 'onsite' | 'hybrid';
  skillsRequired: string[];
  applicationDeadline: Date;
  matchPercentage?: number;
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Date;
  coverLetter: string;
}

// Analytics Types
export interface LearningAnalytics {
  totalTime: number;
  topicsStudied: number;
  quizzesTaken: number;
  averageScore: number;
  streakDays: number;
  weeklyProgress: { day: string; xp: number }[];
}

export interface SecurityAnalytics {
  securityScore: number;
  vulnerabilities: number;
  threatsDetected: number;
  employeesAtRisk: number;
  trainingCompletion: number;
  monthlyTrends: { month: string; score: number }[];
} 
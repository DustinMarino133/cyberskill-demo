'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Award, Target, Clock, Zap, BookOpen,
  Calendar, CheckCircle, Trophy, Star, Brain,
  BarChart3, PieChart, LineChart, Activity, Medal,
  ChevronLeft, ChevronRight, Eye, ArrowUp, ArrowDown, Flame
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface ProgressData {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
  streak: number;
  coursesCompleted: number;
  coursesInProgress: number;
  skillsLearned: string[];
  achievements: Achievement[];
  weeklyProgress: WeeklyProgress[];
  courseProgress: CourseProgress[];
  skillProgress: SkillProgress[];
  studyStats: StudyStats;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface WeeklyProgress {
  week: string;
  xp: number;
  timeSpent: number;
  coursesCompleted: number;
  quizzesTaken: number;
}

interface CourseProgress {
  id: string;
  title: string;
  category: string;
  progress: number;
  timeSpent: number;
  lastActivity: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface SkillProgress {
  skill: string;
  level: number;
  xp: number;
  maxXP: number;
  courses: string[];
  lastPracticed: string;
}

interface StudyStats {
  averageSessionTime: number;
  totalStudyTime: number;
  bestStreak: number;
  favoriteCategory: string;
  strongestSkill: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

export default function ProgressPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const { currentTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadProgressData();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const loadProgressData = () => {
    // Simulate loading progress data
    const data: ProgressData = {
      totalXP: 2847,
      level: 8,
      xpToNextLevel: 453,
      currentLevelXP: 2847,
      streak: 12,
      coursesCompleted: 3,
      coursesInProgress: 2,
      skillsLearned: ['Password Security', 'Phishing Detection', 'Network Basics', 'Encryption', 'Malware Analysis'],
      achievements: [
        {
          id: 'first-quiz',
          title: 'Quiz Master',
          description: 'Complete your first quiz',
          icon: '🎯',
          earned: true,
          earnedDate: '2024-01-15',
          rarity: 'common',
          points: 100
        },
        {
          id: 'week-streak',
          title: 'Dedicated Learner',
          description: 'Maintain a 7-day learning streak',
          icon: '🔥',
          earned: true,
          earnedDate: '2024-01-22',
          rarity: 'rare',
          points: 250
        },
        {
          id: 'course-complete',
          title: 'Course Champion',
          description: 'Complete your first course',
          icon: '🏆',
          earned: true,
          earnedDate: '2024-02-01',
          rarity: 'epic',
          points: 500
        },
        {
          id: 'perfect-score',
          title: 'Perfect Score',
          description: 'Score 100% on a difficult quiz',
          icon: '⭐',
          earned: true,
          earnedDate: '2024-02-05',
          rarity: 'rare',
          points: 300
        },
        {
          id: 'cyber-expert',
          title: 'Cyber Expert',
          description: 'Reach level 10 in cybersecurity',
          icon: '🛡️',
          earned: false,
          rarity: 'legendary',
          points: 1000
        },
        {
          id: 'mentor',
          title: 'Mentor',
          description: 'Help 5 other students',
          icon: '👨‍🏫',
          earned: false,
          rarity: 'epic',
          points: 750
        }
      ],
      weeklyProgress: [
        { week: 'Week 1', xp: 245, timeSpent: 180, coursesCompleted: 0, quizzesTaken: 3 },
        { week: 'Week 2', xp: 380, timeSpent: 220, coursesCompleted: 1, quizzesTaken: 5 },
        { week: 'Week 3', xp: 520, timeSpent: 300, coursesCompleted: 1, quizzesTaken: 7 },
        { week: 'Week 4', xp: 650, timeSpent: 280, coursesCompleted: 1, quizzesTaken: 6 },
        { week: 'Week 5', xp: 420, timeSpent: 240, coursesCompleted: 0, quizzesTaken: 4 },
        { week: 'Week 6', xp: 632, timeSpent: 320, coursesCompleted: 0, quizzesTaken: 8 }
      ],
      courseProgress: [
        {
          id: 'cyber-101',
          title: 'Cybersecurity Fundamentals',
          category: 'Fundamentals',
          progress: 100,
          timeSpent: 240,
          lastActivity: '2024-02-01',
          status: 'completed'
        },
        {
          id: 'network-security',
          title: 'Network Security Essentials',
          category: 'Network',
          progress: 65,
          timeSpent: 180,
          lastActivity: '2024-02-10',
          status: 'in-progress'
        },
        {
          id: 'malware-analysis',
          title: 'Malware Analysis',
          category: 'Malware',
          progress: 30,
          timeSpent: 90,
          lastActivity: '2024-02-08',
          status: 'in-progress'
        },
        {
          id: 'crypto-basics',
          title: 'Cryptography Basics',
          category: 'Cryptography',
          progress: 0,
          timeSpent: 0,
          lastActivity: 'Never',
          status: 'not-started'
        }
      ],
      skillProgress: [
        {
          skill: 'Password Security',
          level: 5,
          xp: 850,
          maxXP: 1000,
          courses: ['Cybersecurity Fundamentals'],
          lastPracticed: '2024-02-09'
        },
        {
          skill: 'Network Security',
          level: 3,
          xp: 420,
          maxXP: 600,
          courses: ['Network Security Essentials'],
          lastPracticed: '2024-02-10'
        },
        {
          skill: 'Malware Detection',
          level: 2,
          xp: 180,
          maxXP: 400,
          courses: ['Malware Analysis'],
          lastPracticed: '2024-02-08'
        },
        {
          skill: 'Phishing Detection',
          level: 4,
          xp: 720,
          maxXP: 800,
          courses: ['Cybersecurity Fundamentals'],
          lastPracticed: '2024-02-07'
        }
      ],
      studyStats: {
        averageSessionTime: 45,
        totalStudyTime: 1320,
        bestStreak: 15,
        favoriteCategory: 'Network Security',
        strongestSkill: 'Password Security',
        weeklyGoal: 300,
        weeklyProgress: 245
      }
    };

    setProgressData(data);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-cyber-green';
      case 'in-progress': return 'text-cyber-blue';
      case 'not-started': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  if (!user || !progressData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ background: currentTheme.colors.background }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: currentTheme.colors.primary }}></div>
          <p style={{ color: currentTheme.colors.textSecondary }}>Loading progress data...</p>
        </div>
      </div>
    );
  }

  const earnedAchievements = progressData.achievements.filter(a => a.earned);
  const unearnedAchievements = progressData.achievements.filter(a => !a.earned);

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center" style={{ color: currentTheme.colors.text }}>
                <TrendingUp className="h-8 w-8 mr-3" style={{ color: currentTheme.colors.accent }} />
                Your Progress
              </h1>
              <p className="mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                Track your cybersecurity learning journey
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/student/dashboard')}
              style={{ 
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text 
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold text-cyber-green">{progressData.totalXP.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-cyber-green/10 rounded-full">
                  <Zap className="h-6 w-6 text-cyber-green" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Level {progressData.level} • {progressData.xpToNextLevel} XP to level {progressData.level + 1}
                </p>
                <Progress 
                  value={(progressData.currentLevelXP / (progressData.currentLevelXP + progressData.xpToNextLevel)) * 100} 
                  className="mt-2 h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-500">{progressData.streak}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Best streak: {progressData.studyStats.bestStreak} days
                </p>
                <div className="mt-2 flex items-center text-xs text-orange-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Keep it up!
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                  <p className="text-2xl font-bold text-primary">{progressData.coursesCompleted}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  {progressData.coursesInProgress} in progress
                </p>
                <div className="mt-2 flex items-center text-xs text-primary">
                  <Target className="h-3 w-3 mr-1" />
                  {Math.round((progressData.coursesCompleted / (progressData.coursesCompleted + progressData.coursesInProgress)) * 100)}% completion rate
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                  <p className="text-2xl font-bold text-cyber-blue">{Math.round(progressData.studyStats.totalStudyTime / 60)}h</p>
                </div>
                <div className="p-3 bg-cyber-blue/10 rounded-full">
                  <Clock className="h-6 w-6 text-cyber-blue" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Avg. session: {progressData.studyStats.averageSessionTime}min
                </p>
                <div className="mt-2 flex items-center text-xs text-cyber-blue">
                  <Activity className="h-3 w-3 mr-1" />
                  {progressData.studyStats.totalStudyTime} minutes total
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                <Target className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                Weekly Goal Progress
              </CardTitle>
              <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                Your learning goal for this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">XP Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {progressData.studyStats.weeklyProgress} / {progressData.studyStats.weeklyGoal} XP
                  </span>
                </div>
                <Progress 
                  value={(progressData.studyStats.weeklyProgress / progressData.studyStats.weeklyGoal) * 100} 
                  className="h-3"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {Math.round((progressData.studyStats.weeklyProgress / progressData.studyStats.weeklyGoal) * 100)}% complete
                  </span>
                  <span>
                    {progressData.studyStats.weeklyGoal - progressData.studyStats.weeklyProgress} XP remaining
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Achievements
                  </CardTitle>
                  <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                    {earnedAchievements.length} of {progressData.achievements.length} achievements unlocked
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                  style={{ 
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text 
                  }}
                >
                  {showAllAchievements ? 'Show Earned Only' : 'Show All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(showAllAchievements ? progressData.achievements : earnedAchievements).map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.earned 
                        ? 'border-cyber-green bg-cyber-green/5' 
                        : 'border-border bg-muted/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getRarityColor(achievement.rarity)}/10`}>
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{achievement.title}</h4>
                          <Badge className={`text-xs ${getRarityColor(achievement.rarity)} text-white`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-cyber-green">
                            +{achievement.points} XP
                          </span>
                          {achievement.earned && achievement.earnedDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(achievement.earnedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Course Progress
              </CardTitle>
              <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                Your progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.courseProgress.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{course.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{course.category}</Badge>
                          <span className={`text-sm font-medium ${getStatusColor(course.status)}`}>
                            {course.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Time spent: {Math.round(course.timeSpent / 60)}h {course.timeSpent % 60}m</span>
                          <span>Last activity: {course.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/student/courses/${course.id}`)}
                      style={{ 
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text 
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skill Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                <Brain className="h-5 w-5 mr-2 text-cyber-purple" />
                Skill Development
              </CardTitle>
              <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                Your mastery level in different cybersecurity skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progressData.skillProgress.map((skill) => (
                  <div key={skill.skill} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{skill.skill}</h4>
                      <Badge variant="secondary">Level {skill.level}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>XP Progress</span>
                        <span className="font-medium">{skill.xp} / {skill.maxXP}</span>
                      </div>
                      <Progress value={(skill.xp / skill.maxXP) * 100} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>Courses: {skill.courses.join(', ')}</div>
                      <div>Last practiced: {skill.lastPracticed}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                <BarChart3 className="h-5 w-5 mr-2 text-cyber-blue" />
                Learning Activity
              </CardTitle>
              <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                Your weekly learning statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-green">
                    {progressData.studyStats.totalStudyTime}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-blue">
                    {progressData.studyStats.averageSessionTime}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Session (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-purple">
                    {progressData.studyStats.favoriteCategory}
                  </div>
                  <div className="text-sm text-muted-foreground">Favorite Topic</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {progressData.studyStats.strongestSkill}
                  </div>
                  <div className="text-sm text-muted-foreground">Strongest Skill</div>
                </div>
              </div>

              {/* Weekly Progress Chart */}
              <div className="space-y-4">
                <h4 className="font-medium">Weekly XP Progress</h4>
                <div className="space-y-2">
                  {progressData.weeklyProgress.map((week) => (
                    <div key={week.week} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-muted-foreground">{week.week}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{week.xp} XP</span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(week.timeSpent / 60)}h {week.timeSpent % 60}m
                          </span>
                        </div>
                        <Progress value={(week.xp / 700) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
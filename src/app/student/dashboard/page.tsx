'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Brain, BookOpen, Target, Trophy, Zap, 
  TrendingUp, Clock, Users, Award, 
  Play, ChevronRight, Star, Flame,
  GraduationCap, Shield, Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile, Course } from '@/lib/types';
import { demoStudent, demoCourses } from '@/lib/demo-data';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

export default function StudentDashboard() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 80 },
    { day: 'Wed', xp: 200 },
    { day: 'Thu', xp: 150 },
    { day: 'Fri', xp: 90 },
    { day: 'Sat', xp: 180 },
    { day: 'Sun', xp: 110 },
  ]);
  const { currentTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const quickActions = [
    {
      title: 'AI Flashcards',
      description: 'Generate smart flashcards for any topic',
      icon: Brain,
      href: '/student/tools/flashcards',
      color: currentTheme.colors.primary,
      gradient: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
    },
    {
      title: 'Practice Quiz',
      description: 'Test your knowledge with AI-generated quizzes',
      icon: Target,
      href: '/student/tools/quiz',
      color: currentTheme.colors.accent,
      gradient: `linear-gradient(135deg, ${currentTheme.colors.accent}, ${currentTheme.colors.primary})`
    },
    {
      title: 'Browse Courses',
      description: 'Explore our comprehensive course catalog',
      icon: BookOpen,
      href: '/student/courses',
      color: currentTheme.colors.secondary,
      gradient: `linear-gradient(135deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent})`
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.colors.background }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: currentTheme.colors.primary }}></div>
          <p style={{ color: currentTheme.colors.textSecondary }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg" style={{ color: currentTheme.colors.textSecondary }}>
            Ready to level up your cybersecurity skills today?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Study Actions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: currentTheme.colors.text }}>
                <Zap className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                Quick Study
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`${currentTheme.styles.cardClass} cursor-pointer transition-all duration-200 hover:shadow-lg`}
                      style={{ borderColor: currentTheme.colors.border }}
                      onClick={() => router.push(action.href)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div 
                            className="p-3 rounded-lg"
                            style={{ background: `${action.color}20` }}
                          >
                            <action.icon className="h-6 w-6" style={{ color: action.color }} />
                          </div>
                          <ChevronRight className="h-5 w-5" style={{ color: currentTheme.colors.textSecondary }} />
                        </div>
                        <h3 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                          {action.title}
                        </h3>
                        <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Continue Learning */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: currentTheme.colors.text }}>
                <Play className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                Continue Learning
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoCourses.slice(0, 2).map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                              {course.title}
                            </h3>
                            <p className="text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                              {course.description}
                            </p>
                          </div>
                          <Badge style={{ backgroundColor: `${currentTheme.colors.primary}20`, color: currentTheme.colors.primary }}>
                            {course.grade}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span style={{ color: currentTheme.colors.textSecondary }}>Progress</span>
                            <span style={{ color: currentTheme.colors.text }}>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${course.progress}%`,
                                backgroundColor: currentTheme.colors.primary
                              }}
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            style={{ 
                              backgroundColor: currentTheme.colors.primary,
                              color: currentTheme.colors.background 
                            }}
                            onClick={() => router.push('/student/courses')}
                          >
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Weekly Progress Chart */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                    <TrendingUp className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                    Your XP gains this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-32">
                    {weeklyProgress.map((day, index) => (
                      <div key={day.day} className="flex flex-col items-center space-y-2">
                        <div 
                          className="w-8 rounded-t transition-all duration-500"
                          style={{ 
                            height: `${(day.xp / 200) * 100}%`,
                            backgroundColor: currentTheme.colors.primary,
                            minHeight: '4px'
                          }}
                        />
                        <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                          {day.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" style={{ color: currentTheme.colors.accent }} />
                      <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Level</span>
                    </div>
                    <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                      {user.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" style={{ color: currentTheme.colors.accent }} />
                      <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>XP</span>
                    </div>
                    <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                      {user.xp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Flame className="h-4 w-4" style={{ color: currentTheme.colors.accent }} />
                      <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Streak</span>
                    </div>
                    <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                      {user.streak} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" style={{ color: currentTheme.colors.accent }} />
                      <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Badges</span>
                    </div>
                    <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                      {user.badges.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.badges.slice(0, 3).map((badge, index) => (
                      <div key={badge.id} className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ 
                            backgroundColor: badge.rarity === 'legendary' ? '#FFD700' : 
                                           badge.rarity === 'epic' ? '#9333EA' :
                                           badge.rarity === 'rare' ? '#3B82F6' : '#10B981',
                            color: '#000'
                          }}
                        >
                          🏆
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm" style={{ color: currentTheme.colors.text }}>
                            {badge.name}
                          </div>
                          <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                            {badge.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    style={{ 
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text 
                    }}
                    onClick={() => router.push('/student/progress')}
                  >
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>
                    Recommended for You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoCourses.slice(2, 4).map((course) => (
                      <div key={course.id} className="p-3 rounded-lg border" style={{ borderColor: currentTheme.colors.border }}>
                        <div className="font-medium text-sm mb-1" style={{ color: currentTheme.colors.text }}>
                          {course.title}
                        </div>
                        <div className="text-xs mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                          {course.grade} • {course.duration} min
                        </div>
                        <div className="flex items-center text-xs" style={{ color: currentTheme.colors.accent }}>
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {course.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    style={{ 
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text 
                    }}
                    onClick={() => router.push('/student/courses')}
                  >
                    Browse All Courses
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 
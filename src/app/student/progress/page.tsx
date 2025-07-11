'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Award, Target, Clock, BookOpen,
  Calendar, CheckCircle, Trophy, Star, Brain,
  BarChart3, Activity, Medal, Crown, ChevronRight, Users,
  Timer, Shield, Eye, TrendingDown, ArrowUp, ArrowDown,
  Sparkles, Flame, Zap, Heart, Gem, Lock, Gift,
  Sword, Map, Compass, Gamepad2, Rocket, Diamond
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface Achievement {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  points: number;
  category: string;
  requirements?: string;
  progress?: number;
  maxProgress?: number;
}

interface ProgressData {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
  streak: number;
  coursesCompleted: number;
  coursesInProgress: number;
  achievements: Achievement[];
  studyStats: StudyStats;
}

interface StudyStats {
  totalStudyTime: number;
  averageSessionTime: number;
  accuracy: number;
  rank: number;
  perfectScores: number;
  questionsAnswered: number;
  hintsUsed: number;
  fastestCompletion: number;
}

const ACHIEVEMENTS_DATA: Achievement[] = [
  // Legendary Achievements
  {
    id: 'cyber-master',
    title: 'Cybersecurity Master',
    description: 'Complete all cybersecurity courses with perfect scores',
    longDescription: 'You have mastered every aspect of cybersecurity education, achieving perfect scores across all courses. This legendary achievement marks you as a true cybersecurity expert.',
    icon: Crown,
    earned: false,
    rarity: 'legendary',
    points: 2500,
    category: 'Mastery',
    requirements: 'Complete all courses with 100% scores',
    progress: 7,
    maxProgress: 12
  },
  {
    id: 'legend-streak',
    title: 'Legendary Streak',
    description: 'Maintain a 100-day learning streak',
    longDescription: 'Your dedication knows no bounds! Maintaining a 100-day learning streak shows incredible commitment to cybersecurity education.',
    icon: Flame,
    earned: false,
    rarity: 'legendary',
    points: 2000,
    category: 'Dedication',
    requirements: 'Study for 100 consecutive days',
    progress: 23,
    maxProgress: 100
  },

  // Epic Achievements
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete advanced assessments in record time',
    longDescription: 'Lightning fast and accurate! You\'ve demonstrated exceptional skill by completing complex cybersecurity assessments faster than anyone else.',
    icon: Rocket,
    earned: true,
    earnedDate: '2024-02-08',
    rarity: 'epic',
    points: 800,
    category: 'Performance',
    requirements: 'Complete 5 assessments in under 10 minutes'
  },
  {
    id: 'perfect-mind',
    title: 'Perfect Mind',
    description: 'Achieve 20 perfect scores in a row',
    longDescription: 'Flawless execution! Your streak of perfect scores demonstrates mastery of cybersecurity concepts and attention to detail.',
    icon: Diamond,
      earned: true,
    earnedDate: '2024-02-15',
    rarity: 'epic',
    points: 750,
    category: 'Excellence',
    requirements: 'Score 100% on 20 consecutive quizzes'
  },
  {
    id: 'course-conqueror',
    title: 'Course Conqueror',
    description: 'Complete 10 cybersecurity courses',
    longDescription: 'A true scholar! You\'ve conquered multiple cybersecurity domains, building expertise across the field.',
    icon: Trophy,
    earned: false,
    rarity: 'epic',
    points: 1000,
    category: 'Learning',
    requirements: 'Complete 10 different courses',
    progress: 7,
    maxProgress: 10
  },
  {
    id: 'mentor-supreme',
    title: 'Mentor Supreme',
    description: 'Help 50 fellow students succeed',
    longDescription: 'Your knowledge shines brightest when shared! You\'ve helped dozens of students on their cybersecurity journey.',
    icon: Users,
    earned: false,
    rarity: 'epic',
    points: 900,
    category: 'Community',
    requirements: 'Successfully mentor 50 students',
    progress: 12,
    maxProgress: 50
  },

  // Rare Achievements
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Maintain a 30-day learning streak',
    longDescription: 'Consistency is key to mastery! Your dedication to daily learning shows true commitment to cybersecurity education.',
    icon: Activity,
      earned: true,
      earnedDate: '2024-01-22',
      rarity: 'rare',
    points: 400,
    category: 'Consistency',
    requirements: 'Study for 30 consecutive days'
  },
  {
    id: 'night-owl',
    title: 'Night Owl Scholar',
    description: 'Complete 25 late-night study sessions',
    longDescription: 'Burning the midnight oil! Your dedication to learning extends well into the night hours.',
    icon: Eye,
      earned: true,
    earnedDate: '2024-02-10',
    rarity: 'rare',
    points: 350,
    category: 'Dedication',
    requirements: 'Study between 10 PM and 2 AM for 25 sessions'
  },
  {
    id: 'quiz-champion',
    title: 'Quiz Champion',
    description: 'Excel in 100 practice quizzes',
    longDescription: 'Practice makes perfect! You\'ve demonstrated exceptional knowledge through consistent quiz performance.',
    icon: Brain,
    earned: false,
    rarity: 'rare',
      points: 500,
    category: 'Knowledge',
    requirements: 'Score 85%+ on 100 quizzes',
    progress: 67,
    maxProgress: 100
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Connect with 25 classmates',
    longDescription: 'Learning is better together! You\'ve built a strong network within the cybersecurity community.',
    icon: Heart,
      earned: true,
    earnedDate: '2024-02-12',
      rarity: 'rare',
      points: 300,
    category: 'Social',
    requirements: 'Connect with 25 different students'
  },

  // Common Achievements
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first cybersecurity quiz',
    longDescription: 'Every expert was once a beginner! You\'ve taken your first step into the world of cybersecurity.',
    icon: Target,
      earned: true,
    earnedDate: '2024-01-15',
    rarity: 'common',
    points: 100,
    category: 'Getting Started',
    requirements: 'Complete your first quiz'
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete 10 morning study sessions',
    longDescription: 'The early bird catches the worm! Starting your day with cybersecurity learning sets a productive tone.',
    icon: Clock,
    earned: true,
    earnedDate: '2024-01-28',
    rarity: 'common',
    points: 150,
    category: 'Habits',
    requirements: 'Study before 8 AM for 10 sessions'
  },
  {
    id: 'curious-learner',
    title: 'Curious Learner',
    description: 'Ask 25 thoughtful questions',
    longDescription: 'Curiosity drives learning! Your thoughtful questions show engagement and desire to understand.',
    icon: BookOpen,
    earned: true,
    earnedDate: '2024-02-01',
    rarity: 'common',
    points: 200,
    category: 'Engagement',
    requirements: 'Ask 25 questions in courses or forums'
  },
  {
    id: 'tool-explorer',
    title: 'Tool Explorer',
    description: 'Try all 5 learning tools',
    longDescription: 'Exploration leads to discovery! You\'ve experimented with all available learning tools to find your style.',
    icon: Gamepad2,
    earned: true,
    earnedDate: '2024-02-03',
    rarity: 'common',
    points: 125,
    category: 'Exploration',
    requirements: 'Use Quiz Builder, Flashcards, AI Companion, Course Builder, and Calculator'
  },

  // Hidden/Special Achievements
  {
    id: 'easter-egg',
    title: 'Secret Hunter',
    description: 'Discover the hidden easter egg',
    longDescription: 'You have a keen eye for details! Finding hidden secrets shows you pay attention to every aspect of your learning environment.',
    icon: Gem,
    earned: false,
    rarity: 'mythic',
    points: 1337,
    category: 'Special',
    requirements: '???'
  },
  {
    id: 'code-breaker',
    title: 'Code Breaker',
    description: 'Solve the cryptography challenge',
    longDescription: 'Your analytical mind has cracked the code! This special challenge tested your cryptography knowledge.',
    icon: Shield,
    earned: false,
    rarity: 'mythic',
    points: 999,
    category: 'Special',
    requirements: 'Solve the hidden cryptography puzzle'
  }
];

const INITIAL_PROGRESS_DATA: ProgressData = {
  totalXP: 12847,
  level: 8,
  xpToNextLevel: 1653,
  currentLevelXP: 12847,
  streak: 23,
  coursesCompleted: 7,
  coursesInProgress: 3,
  achievements: ACHIEVEMENTS_DATA,
  studyStats: {
    totalStudyTime: 2847,
    averageSessionTime: 45,
    accuracy: 91,
    rank: 127,
    perfectScores: 23,
    questionsAnswered: 1456,
    hintsUsed: 89,
    fastestCompletion: 3.2
  }
};

export default function ProgressPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [progressData, setProgressData] = useState<ProgressData>(INITIAL_PROGRESS_DATA);
  const [showAchievements, setShowAchievements] = useState<'all' | 'earned' | 'available' | 'legendary' | 'epic' | 'rare' | 'common'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
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

  const filteredAchievements = useMemo(() => {
    if (showAchievements === 'earned') {
      return progressData.achievements.filter(a => a.earned);
    } else if (showAchievements === 'available') {
      return progressData.achievements.filter(a => !a.earned);
    } else if (['legendary', 'epic', 'rare', 'common'].includes(showAchievements)) {
      return progressData.achievements.filter(a => a.rarity === showAchievements);
    }
    return progressData.achievements;
  }, [progressData.achievements, showAchievements]);

  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'mythic': return 'bg-pink-100 text-pink-700 border-pink-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }, []);

  const getRarityGlow = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-200';
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-orange-200';
      case 'mythic': return 'shadow-pink-200';
      default: return 'shadow-gray-200';
    }
  }, []);

  const levelProgress = (progressData.totalXP % 1000) / 10;
  const earnedAchievements = progressData.achievements.filter(a => a.earned);
  const totalAchievements = progressData.achievements.length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400 font-medium">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Achievements</h1>
          <p className="text-gray-400">Track your cybersecurity learning journey and unlock rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">Current Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{progressData.level}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Progress</span>
                    <span>{levelProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={levelProgress} className="h-2 bg-white/20" />
                  <p className="text-xs opacity-80">{progressData.xpToNextLevel} XP to next level</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">Total XP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{progressData.totalXP.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 opacity-80" />
                  <span className="text-sm opacity-90">Experience Points</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">Study Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{progressData.streak}</div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 opacity-80" />
                  <span className="text-sm opacity-90">Days in a row</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{earnedAchievements.length}/{totalAchievements}</div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 opacity-80" />
                  <span className="text-sm opacity-90">Unlocked</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Achievements', count: totalAchievements },
              { key: 'earned', label: 'Earned', count: earnedAchievements.length },
              { key: 'available', label: 'Available', count: totalAchievements - earnedAchievements.length },
              { key: 'legendary', label: 'Legendary', count: progressData.achievements.filter(a => a.rarity === 'legendary').length },
              { key: 'epic', label: 'Epic', count: progressData.achievements.filter(a => a.rarity === 'epic').length },
              { key: 'rare', label: 'Rare', count: progressData.achievements.filter(a => a.rarity === 'rare').length },
              { key: 'common', label: 'Common', count: progressData.achievements.filter(a => a.rarity === 'common').length }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={showAchievements === filter.key ? 'default' : 'outline'}
                onClick={() => setShowAchievements(filter.key as any)}
                className={`${showAchievements === filter.key ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                size="sm"
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group cursor-pointer ${getRarityGlow(achievement.rarity)}`}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <Card className={`transition-all hover:shadow-lg ${
                achievement.earned 
                  ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50' 
                  : 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border-gray-700/30 hover:border-gray-600/30'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-16 h-16 rounded-xl flex items-center justify-center transition-all group-hover:scale-110
                      ${achievement.earned 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                        : 'bg-gray-600/50'
                      }
                    `}>
                      {achievement.earned ? (
                        <achievement.icon className="h-8 w-8 text-white" />
                      ) : (
                        <Lock className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-bold text-lg ${
                          achievement.earned ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.title}
                        </h3>
                      </div>
                      
                      <Badge className={`${getRarityColor(achievement.rarity)} mb-2 capitalize`}>
                        {achievement.rarity}
                      </Badge>
                      
                      <p className={`text-sm mb-3 ${
                        achievement.earned ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      
                      {achievement.progress !== undefined && !achievement.earned && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress!) * 100} 
                            className="h-1.5 bg-gray-700" 
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-400">
                          +{achievement.points} XP
                        </span>
                        {achievement.earned && achievement.earnedDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(achievement.earnedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Study Statistics */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Study Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.floor(progressData.studyStats.totalStudyTime / 60)}h {progressData.studyStats.totalStudyTime % 60}m
                </div>
                <div className="text-sm text-gray-400">Total Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{progressData.studyStats.accuracy}%</div>
                <div className="text-sm text-gray-400">Quiz Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{progressData.studyStats.perfectScores}</div>
                <div className="text-sm text-gray-400">Perfect Scores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">#{progressData.studyStats.rank}</div>
                <div className="text-sm text-gray-400">Global Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`
                  w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center
                  ${selectedAchievement.earned 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                    : 'bg-gray-600/50'
                  }
                `}>
                  {selectedAchievement.earned ? (
                    <selectedAchievement.icon className="h-10 w-10 text-white" />
                  ) : (
                    <Lock className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                
                <Badge className={`${getRarityColor(selectedAchievement.rarity)} mb-3 capitalize`}>
                  {selectedAchievement.rarity}
                </Badge>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedAchievement.title}
                </h2>
                
                <p className="text-gray-300 mb-4">
                  {selectedAchievement.longDescription}
                </p>
                
                {selectedAchievement.requirements && (
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700/50">
                    <h3 className="font-semibold text-white mb-2">Requirements:</h3>
                    <p className="text-sm text-gray-400">{selectedAchievement.requirements}</p>
                  </div>
                )}
                
                {selectedAchievement.progress !== undefined && !selectedAchievement.earned && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{selectedAchievement.progress}/{selectedAchievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(selectedAchievement.progress / selectedAchievement.maxProgress!) * 100} 
                      className="h-2 bg-gray-700" 
                    />
                  </div>
                )}
                
                <div className="text-lg font-bold text-purple-400 mb-4">
                  Reward: +{selectedAchievement.points} XP
                </div>
                
                {selectedAchievement.earned && selectedAchievement.earnedDate && (
                  <p className="text-sm text-gray-500">
                    Earned on {new Date(selectedAchievement.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <Button 
                onClick={() => setSelectedAchievement(null)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
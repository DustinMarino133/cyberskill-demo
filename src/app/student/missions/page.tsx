'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Trophy, Calendar, Clock, Star, 
  Zap, CheckCircle, Lock, Gift, Flame,
  Shield, Brain, BookOpen, Award,
  TrendingUp, Users, FileText, Sparkles,
  GraduationCap, Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  category: 'learning' | 'social' | 'achievement' | 'skill';
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    coins: number;
    item?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft?: string;
  completed: boolean;
  locked: boolean;
  icon: any;
}

export default function MissionsPage() {
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'shop'>('active');
  const [userStats, setUserStats] = useState({
    dailyStreak: 7,
    weeklyStreak: 3,
    totalCompleted: 156,
    totalXPEarned: 12450
  });

  const missions: Mission[] = [
    // Daily Missions
    {
      id: 'daily-quiz',
      title: 'Knowledge Check',
      description: 'Complete 3 practice quizzes to test your cybersecurity knowledge',
      type: 'daily',
      category: 'learning',
      progress: 2,
      maxProgress: 3,
      reward: { xp: 50, coins: 25 },
      difficulty: 'easy',
      timeLeft: '18h 45m',
      completed: false,
      locked: false,
      icon: Brain
    },
    {
      id: 'daily-study',
      title: 'Study Session',
      description: 'Study for 30 minutes using flashcards or course materials',
      type: 'daily',
      category: 'learning',
      progress: 15,
      maxProgress: 30,
      reward: { xp: 75, coins: 35 },
      difficulty: 'medium',
      timeLeft: '18h 45m',
      completed: false,
      locked: false,
      icon: BookOpen
    },
    {
      id: 'daily-streak',
      title: 'Login Streak',
      description: 'Maintain your daily login streak - 7 days in a row!',
      type: 'daily',
      category: 'achievement',
      progress: 7,
      maxProgress: 7,
      reward: { xp: 100, coins: 50, item: 'Streak Master Badge' },
      difficulty: 'easy',
      timeLeft: '18h 45m',
      completed: true,
      locked: false,
      icon: Flame
    },

    // Weekly Missions
    {
      id: 'weekly-master',
      title: 'Course Master',
      description: 'Complete 5 different courses this week',
      type: 'weekly',
      category: 'learning',
      progress: 3,
      maxProgress: 5,
      reward: { xp: 200, coins: 100 },
      difficulty: 'hard',
      timeLeft: '4d 12h',
      completed: false,
      locked: false,
      icon: GraduationCap
    },
    {
      id: 'weekly-social',
      title: 'Team Player',
      description: 'Help 3 classmates with their assignments',
      type: 'weekly',
      category: 'social',
      progress: 1,
      maxProgress: 3,
      reward: { xp: 150, coins: 75 },
      difficulty: 'medium',
      timeLeft: '4d 12h',
      completed: false,
      locked: false,
      icon: Users
    },
    {
      id: 'weekly-perfectionist',
      title: 'Perfect Scores',
      description: 'Get 100% on 3 different assignments',
      type: 'weekly',
      category: 'achievement',
      progress: 2,
      maxProgress: 3,
      reward: { xp: 300, coins: 150, item: 'Perfectionist Crown' },
      difficulty: 'hard',
      timeLeft: '4d 12h',
      completed: false,
      locked: false,
      icon: Crown
    },

    // Special Missions
    {
      id: 'special-hacker',
      title: 'Ethical Hacker',
      description: 'Complete the advanced penetration testing course',
      type: 'special',
      category: 'skill',
      progress: 0,
      maxProgress: 1,
      reward: { xp: 500, coins: 250, item: 'Hacker Badge' },
      difficulty: 'hard',
      completed: false,
      locked: true,
      icon: Shield
    },
    {
      id: 'special-mentor',
      title: 'Mentor Status',
      description: 'Help 10 students and maintain 4.8+ rating',
      type: 'special',
      category: 'social',
      progress: 0,
      maxProgress: 10,
      reward: { xp: 1000, coins: 500, item: 'Mentor Crown' },
      difficulty: 'hard',
      completed: false,
      locked: true,
      icon: Trophy
    }
  ];

  const completedMissionsList: Mission[] = [
    {
      id: 'completed-1',
      title: 'First Steps',
      description: 'Complete your first cybersecurity course',
      type: 'special',
      category: 'achievement',
      progress: 1,
      maxProgress: 1,
      reward: { xp: 100, coins: 50, item: 'Beginner Badge' },
      difficulty: 'easy',
      completed: true,
      locked: false,
      icon: Star
    },
    {
      id: 'completed-2',
      title: 'Quiz Master',
      description: 'Complete 50 practice quizzes',
      type: 'special',
      category: 'learning',
      progress: 50,
      maxProgress: 50,
      reward: { xp: 250, coins: 125, item: 'Quiz Master Badge' },
      difficulty: 'medium',
      completed: true,
      locked: false,
      icon: Brain
    }
  ];

  useEffect(() => {
    const active = missions.filter(m => !m.completed);
    const completed = missions.filter(m => m.completed).concat(completedMissionsList);
    setActiveMissions(active);
    setCompletedMissions(completed);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'weekly':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'special':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleClaimReward = (missionId: string) => {
    // In a real app, this would claim the reward
    console.log(`Claiming reward for mission ${missionId}`);
  };

  const renderMissionCard = (mission: Mission) => (
    <motion.div
      key={mission.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-gray-900/50 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300
        ${mission.locked ? 'opacity-50 border-gray-700' : 'border-gray-800 hover:border-gray-600'}
        ${mission.completed ? 'border-green-500/30' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            h-10 w-10 rounded-lg flex items-center justify-center
            ${mission.completed ? 'bg-green-500/20' : 'bg-blue-500/20'}
          `}>
            {mission.locked ? (
              <Lock className="h-5 w-5 text-gray-400" />
            ) : mission.completed ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <mission.icon className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${mission.locked ? 'text-gray-400' : 'text-white'}`}>
              {mission.title}
            </h3>
            <p className={`text-sm ${mission.locked ? 'text-gray-500' : 'text-gray-400'}`}>
              {mission.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getTypeColor(mission.type)} capitalize`}>
            {mission.type}
          </Badge>
          <Badge className={`${getDifficultyColor(mission.difficulty)} capitalize`}>
            {mission.difficulty}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      {!mission.locked && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-white">
              {mission.progress}/{mission.maxProgress}
            </span>
          </div>
          <Progress 
            value={(mission.progress / mission.maxProgress) * 100} 
            className="h-2"
          />
        </div>
      )}

      {/* Rewards */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">+{mission.reward.xp} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-yellow-400">🪙</span>
            <span className="text-sm font-semibold text-yellow-400">+{mission.reward.coins}</span>
          </div>
          {mission.reward.item && (
            <div className="flex items-center gap-1">
              <Gift className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-400">{mission.reward.item}</span>
            </div>
          )}
        </div>
        
        {mission.completed && !mission.locked && (
          <Button 
            onClick={() => handleClaimReward(mission.id)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Claim Reward
          </Button>
        )}
        
        {mission.timeLeft && !mission.completed && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            {mission.timeLeft}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <div className="space-y-6">
            {activeMissions.map(mission => renderMissionCard(mission))}
          </div>
        );
      case 'completed':
        return (
          <div className="space-y-6">
            {completedMissions.map(mission => renderMissionCard(mission))}
          </div>
        );
      case 'shop':
        return (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Mission Shop</h3>
            <p className="text-gray-400 mb-6">Use your earned coins to unlock exclusive mission rewards!</p>
            <Button 
              onClick={() => window.location.href = '/student/shop'}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Visit Shop
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Missions</h1>
                <p className="text-gray-400">Complete challenges to earn XP, coins, and exclusive rewards</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{userStats.dailyStreak}</div>
                <div className="text-sm text-gray-400">Daily Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{userStats.weeklyStreak}</div>
                <div className="text-sm text-gray-400">Weekly Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{userStats.totalCompleted}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{userStats.totalXPEarned}</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'active', label: 'Active Missions', icon: Target },
              { id: 'completed', label: 'Completed', icon: CheckCircle },
              { id: 'shop', label: 'Mission Shop', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-4 border-b-2 transition-all
                  ${activeTab === tab.id 
                    ? 'border-purple-500 text-purple-400' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
} 
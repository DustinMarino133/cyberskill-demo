'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, Brain, Trophy, TrendingUp,
  Clock, ChevronRight, Target, Award,
  Gift, Gem, Sparkles, Star, Zap,
  X, Check, Calendar, FileText, CheckCircle,
  AlertCircle, XCircle, Timer, 
  CalendarDays, User, Users, MessageSquare,
  GraduationCap, ShoppingBag, Palette, Book, ChevronLeft,
  Video, Monitor, BarChart3, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface DailyChestReward {
  type: 'coins' | 'xp' | 'booster' | 'theme';
  amount: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ComponentType<any>;
}

interface WorkItem {
  id: string;
  title: string;
  course: string;
  type: 'assignment' | 'quiz' | 'project' | 'reading';
  deadline: string;
  status: 'due_soon' | 'overdue' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

export default function StudentDashboard() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [coins, setCoins] = useState(9999);
  const [showChestModal, setShowChestModal] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [chestReward, setChestReward] = useState<DailyChestReward | null>(null);
  const [canClaimChest, setCanClaimChest] = useState(false);
  const [timeUntilNextChest, setTimeUntilNextChest] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date(2025, 6, 1)); // July 2025
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const router = useRouter();

  // Apps menu items (replaced Calculator with Classroom)
  const appMenuItems = [
    { label: 'Videos', href: '/student/courses', icon: Video, color: 'text-red-400' },
    { label: 'AI Companion', href: '/student/tools/ai-companion', icon: Brain, color: 'text-purple-400' },
    { label: 'Quiz Builder', href: '/student/tools/quiz', icon: FileText, color: 'text-blue-400' },
    { label: 'Flashcards', href: '/student/tools/flashcards', icon: BookOpen, color: 'text-green-400' },
    { label: 'Classroom', href: '/student/classroom', icon: Monitor, color: 'text-orange-400' },
    { label: 'Dashboard', href: '/student/dashboard', icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Shop', href: '/student/shop', icon: ShoppingBag, color: 'text-pink-400' },
    { label: 'Progress', href: '/student/progress', icon: Award, color: 'text-yellow-400' },
    { label: 'Settings', href: '/student/settings', icon: Settings, color: 'text-gray-400' }
  ];

  // Daily chest logic
  useEffect(() => {
    const checkDailyChest = () => {
      const lastClaim = localStorage.getItem('lastChestClaim');
      const now = new Date();
      const today = now.toDateString();
      
      if (!lastClaim || new Date(lastClaim).toDateString() !== today) {
        setCanClaimChest(true);
        setTimeUntilNextChest('');
      } else {
        setCanClaimChest(false);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNextChest(`${hours}h ${minutes}m`);
      }
    };

    checkDailyChest();
    const interval = setInterval(checkDailyChest, 60000);
    return () => clearInterval(interval);
  }, []);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const generateReward = (): DailyChestReward => {
    const rewards = [
      { type: 'coins' as const, amount: 100, name: '100 Coins', rarity: 'common' as const, icon: Gem },
      { type: 'coins' as const, amount: 250, name: '250 Coins', rarity: 'rare' as const, icon: Gem },
      { type: 'coins' as const, amount: 500, name: '500 Coins', rarity: 'epic' as const, icon: Gem },
      { type: 'xp' as const, amount: 50, name: '50 XP Bonus', rarity: 'common' as const, icon: Star },
      { type: 'xp' as const, amount: 100, name: '100 XP Bonus', rarity: 'rare' as const, icon: Star },
      { type: 'booster' as const, amount: 25, name: 'XP Booster (25%)', rarity: 'rare' as const, icon: Zap },
      { type: 'booster' as const, amount: 50, name: 'XP Booster (50%)', rarity: 'epic' as const, icon: Zap },
      { type: 'theme' as const, amount: 1, name: 'Random Theme', rarity: 'legendary' as const, icon: Sparkles }
    ];

    const weights = {
      common: 50,
      rare: 30,
      epic: 15,
      legendary: 5
    };

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const [rarity, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        const rarityRewards = rewards.filter(r => r.rarity === rarity);
        return rarityRewards[Math.floor(Math.random() * rarityRewards.length)];
      }
    }
    
    return rewards[0];
  };

  const openChest = () => {
    if (!canClaimChest) return;
    
    const reward = generateReward();
    setChestReward(reward);
    setChestOpened(true);
    
    if (reward.type === 'coins') {
      const newCoins = coins + reward.amount;
      setCoins(newCoins);
      localStorage.setItem('userCoins', newCoins.toString());
    }
    
    localStorage.setItem('lastChestClaim', new Date().toISOString());
    setCanClaimChest(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-green-400 border-green-400 bg-green-400/10';
      case 'rare': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      case 'epic': return 'text-purple-400 border-purple-400 bg-purple-400/10';
      case 'legendary': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  // Work to do items (assignments with deadlines)
  const workItems: WorkItem[] = [
    {
      id: '1',
      title: 'Network Security Quiz',
      course: 'Network Security Basics',
      type: 'quiz',
      deadline: 'Tomorrow 11:59 PM',
      status: 'due_soon',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Cryptography Project',
      course: 'Introduction to Cryptography',
      type: 'project',
      deadline: 'Jan 25, 2024',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Security Policy Essay',
      course: 'Web Security',
      type: 'assignment',
      deadline: 'Yesterday',
      status: 'overdue',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Chapter 5 Reading',
      course: 'Network Security Basics',
      type: 'reading',
      deadline: 'Next Week',
      status: 'upcoming',
      priority: 'low'
    }
  ];

  // Updated quick actions for better tools
  const quickActions = [
    {
      title: 'AI Companion',
      description: 'Get instant help from AI tutor',
      icon: MessageSquare,
      action: () => router.push('/student/tools/ai-companion'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Quiz Builder',
      description: 'Create practice quizzes',
      icon: FileText,
      action: () => router.push('/student/tools/quiz'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Shop & Themes',
      description: 'Customize your experience',
      icon: ShoppingBag,
      action: () => router.push('/student/shop'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Daily Chest',
      description: canClaimChest ? 'Claim your daily reward!' : `Next chest: ${timeUntilNextChest}`,
      icon: Gift,
      action: () => setShowChestModal(true),
      color: canClaimChest ? 'from-yellow-500 to-orange-500' : 'from-gray-500 to-gray-600',
      disabled: !canClaimChest
    }
  ];

  const getWorkItemColor = (status: string, priority: string) => {
    if (status === 'overdue') return 'border-red-500/50 bg-red-500/10';
    if (status === 'due_soon' && priority === 'high') return 'border-orange-500/50 bg-orange-500/10';
    if (status === 'due_soon') return 'border-yellow-500/50 bg-yellow-500/10';
    return 'border-blue-500/20 bg-blue-500/10';
  };

  const getWorkItemIcon = (type: string) => {
    switch (type) {
      case 'quiz': return FileText;
      case 'assignment': return BookOpen;
      case 'project': return Target;
      case 'reading': return Book;
      default: return FileText;
    }
  };

  // Mini calendar component
  const renderMiniCalendar = () => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const today = new Date();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-6 h-6"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      days.push(
        <div
          key={day}
          className={`w-6 h-6 text-xs flex items-center justify-center rounded cursor-pointer ${
            isToday 
              ? 'bg-blue-500 text-white font-bold' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          {day}
        </div>
      );
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
      setViewDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    };

    const navigateYear = (direction: 'prev' | 'next') => {
      setViewDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setFullYear(newDate.getFullYear() - 1);
        } else {
          newDate.setFullYear(newDate.getFullYear() + 1);
        }
        return newDate;
      });
    };

    return (
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Calendar</h3>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigateYear('prev')}
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => navigateMonth('prev')}
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-300 font-medium">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigateMonth('next')}
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-white"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => navigateYear('next')}
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-white"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-xs text-gray-500 font-medium">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}
              </h1>
          <p className="text-gray-400">
            Ready to continue your cybersecurity journey?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total XP
                  </CardTitle>
                  <Trophy className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{user.xp}</div>
                  <p className="text-xs text-gray-400">Level {user.level}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Courses
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-gray-400">In progress</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Study Streak
                  </CardTitle>
                  <Clock className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{user.streak}</div>
                  <p className="text-xs text-gray-400">Days</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Achievements
                  </CardTitle>
                  <Award className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{user.badges?.length || 0}</div>
                  <p className="text-xs text-gray-400">Earned</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Work To Do */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Target className="h-5 w-5 text-white" />
                  <span>Work To Do</span>
                </h2>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/student/assignments')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {workItems.map((item) => {
                  const ItemIcon = getWorkItemIcon(item.type);
                  return (
                    <Card 
                      key={item.id}
                      className={`bg-gradient-to-br backdrop-blur-md border transition-all duration-200 hover:border-blue-400/40 ${getWorkItemColor(item.status, item.priority)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <ItemIcon className="h-5 w-5 text-white" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                                {item.priority === 'high' && (
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                    High Priority
                                  </Badge>
                                )}
                                {item.status === 'overdue' && (
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                    Overdue
                                  </Badge>
                                )}
                                {item.status === 'due_soon' && (
                                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                    Due Soon
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{item.course}</p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{item.deadline}</span>
                                </span>
                                <span>•</span>
                                <span>{item.type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Quick Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index}
                    className={`backdrop-blur-md border-blue-500/20 cursor-pointer transition-all duration-200 hover:border-blue-400/40 ${
                      action.disabled 
                        ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 opacity-60 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
                    } ${action.title === 'Daily Chest' && canClaimChest ? 'border-yellow-400/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/10' : ''}`}
                    onClick={action.disabled ? undefined : action.action}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-20`}>
                          <action.icon className={`h-6 w-6 ${
                            action.title === 'Daily Chest' && canClaimChest ? 'text-yellow-400' : 'text-white'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${
                            action.title === 'Daily Chest' && canClaimChest ? 'text-yellow-400' : 'text-white'
                          }`}>
                            {action.title}
                          </CardTitle>
                          <CardDescription className={
                            action.title === 'Daily Chest' && canClaimChest ? 'text-yellow-300/70' : 'text-gray-400'
                          }>
                            {action.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Mini Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {renderMiniCalendar()}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-medium text-white">Quick Links</h3>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/student/courses')}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/20"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    My Courses
                  </Button>
                  <Button
                    onClick={() => router.push('/student/progress')}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/20"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Progress
                  </Button>
                  <Button
                    onClick={() => router.push('/student/settings')}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/20"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Daily Chest Modal */}
        {showChestModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-blue-500/20"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <motion.div
                    animate={chestOpened ? { scale: 1.1 } : {}}
                    className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center"
                  >
                    <Gift className="h-10 w-10 text-white" />
                  </motion.div>
                  {chestOpened && chestReward && (
                    <motion.div
                      initial={{ scale: 0, y: 0 }}
                      animate={{ scale: 1, y: -30 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <chestReward.icon className="h-8 w-8 text-yellow-300" />
                    </motion.div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {chestOpened ? 'Chest Opened!' : 'Daily Chest'}
                </h3>

                {chestOpened && chestReward ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getRarityColor(chestReward.rarity)}`}>
                      <h4 className="font-medium mb-1">{chestReward.name}</h4>
                      <Badge className={getRarityColor(chestReward.rarity)}>
                        {chestReward.rarity}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => {
                        setShowChestModal(false);
                        setChestOpened(false);
                        setChestReward(null);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    >
                      Awesome!
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400 mb-4">
                      {canClaimChest 
                        ? 'Click to open your daily reward chest!' 
                        : `Come back in ${timeUntilNextChest} for your next reward.`
                      }
                    </p>
                    <div className="flex gap-3">
                <Button 
                        onClick={() => setShowChestModal(false)}
                  variant="outline" 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={openChest}
                        disabled={!canClaimChest}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white disabled:opacity-50"
                      >
                        {canClaimChest ? 'Open Chest' : 'Not Ready'}
                </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
} 
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, User, Bell, Search, LogOut, Settings,
  ChevronDown, Menu, X, Crown, Gem, Book, Brain,
  Palette, Target, GraduationCap, BarChart3, Monitor,
  Grid3x3, Video, BookOpen, FileText, ShoppingBag,
  Award, ClipboardList, MessageSquare, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@/lib/types';

interface NavbarProps {
  user?: UserType | null;
  notifications?: number;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  hasDropdown?: boolean;
  dropdownType?: 'learning' | 'cosmetic' | 'classroom';
}

interface NotificationItem {
  id: string;
  type: 'assignment' | 'grade';
  courseCode: string;
  teacherName: string;
  title: string;
  deadline?: string;
  grade?: number;
  maxPoints?: number;
}

interface AppMenuItem {
  label: string;
  href: string;
  icon: any;
  color: string;
}

function NavbarComponent({ user: propUser, notifications = 0 }: NavbarProps = {}) {
  const [user, setUser] = useState<UserType | null>(propUser || null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLearningHubOpen, setIsLearningHubOpen] = useState(false);
  const [isCosmeticOpen, setIsCosmeticOpen] = useState(false);
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(9999);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(250);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const router = useRouter();

  // Refs for click outside functionality
  const notificationsRef = useRef<HTMLDivElement>(null);
  const appsMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const learningHubRef = useRef<HTMLDivElement>(null);
  const cosmeticRef = useRef<HTMLDivElement>(null);

  // Click outside functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) {
        setIsAppsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (learningHubRef.current && !learningHubRef.current.contains(event.target as Node)) {
        setIsLearningHubOpen(false);
      }
      if (cosmeticRef.current && !cosmeticRef.current.contains(event.target as Node)) {
        setIsCosmeticOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } else if (propUser) {
          setUser(propUser);
        }

        const coins = localStorage.getItem('userCoins');
        const level = localStorage.getItem('userLevel');
        const xp = localStorage.getItem('userXP');
        const classData = localStorage.getItem('selectedClass');
        
        if (coins) {
          setUserCoins(parseInt(coins));
        } else {
          // Default to 9999 coins for new users
          setUserCoins(9999);
          localStorage.setItem('userCoins', '9999');
        }
        
        if (level) setUserLevel(parseInt(level));
        if (xp) setUserXP(parseInt(xp));
        if (classData) setSelectedClass(JSON.parse(classData));
        
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [propUser]);

  // Learning Hub items (AI Tools and Learning Resources)
  const learningHubItems = [
    { label: 'AI Companion', href: '/student/tools/ai-companion', icon: MessageSquare, description: 'Chat with AI tutor for personalized help' },
    { label: 'Quiz Builder', href: '/student/tools/quiz', icon: FileText, description: 'Create AI-powered practice quizzes' },
    { label: 'Flashcards', href: '/student/tools/flashcards', icon: Brain, description: 'Interactive 3D study flashcards' },
    { label: 'Course Builder', href: '/student/tools/course-builder', icon: GraduationCap, description: 'Build custom learning courses' },
    { label: 'All Tools', href: '/student/tools', icon: Sparkles, description: 'Browse all AI learning tools' }
  ];

  // Cyber Shop items (Shop, Achievements, Missions)
  const cosmeticItems = [
    { label: 'Shop', href: '/student/shop', icon: ShoppingBag, description: 'Buy themes, cursors, and upgrades' },
    { label: 'Achievements', href: '/student/progress', icon: Award, description: 'View your badges and progress' },
    { label: 'Missions', href: '/student/missions', icon: Target, description: 'Complete daily and weekly challenges' }
  ];

  // Sample notifications (only quiz notifications from 30 days to 2 days ago)
  const notificationItems: NotificationItem[] = [
    {
      id: '1',
      type: 'assignment',
      courseCode: 'CS6-2024',
      teacherName: 'Ms. Sarah Johnson',
      title: 'Network Security Quiz',
      deadline: 'Completed 3 days ago'
    },
    {
      id: '2',
      type: 'assignment',
      courseCode: 'CS6-2024',
      teacherName: 'Ms. Sarah Johnson',
      title: 'Cryptography Quiz',
      deadline: 'Completed 5 days ago'
    },
    {
      id: '3',
      type: 'assignment',
      courseCode: 'ACD12-2024',
      teacherName: 'Mr. David Chen',
      title: 'Password Security Quiz',
      deadline: 'Completed 1 week ago'
    }
  ];

  // Universal Apps Menu items (replaced Calculator with Classroom)
  const appMenuItems: AppMenuItem[] = [
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

  // Navigation items based on user role
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    const baseItems: NavItem[] = [
      { label: 'Dashboard', href: `/${user.role}/dashboard`, icon: Target }
    ];

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          { label: 'Videos', href: '/student/courses', icon: Book },
          { label: 'Learning Hub', href: '#', icon: Brain, hasDropdown: true, dropdownType: 'learning' },
          { label: 'Cyber Shop', href: '#', icon: Palette, hasDropdown: true, dropdownType: 'cosmetic' },
          { label: selectedClass?.classCode || 'ACD12-2024', href: '/student/classroom', icon: Monitor }
        ];
      case 'teacher':
        return [
          ...baseItems,
          { label: 'Classes', href: '/teacher/classes', icon: GraduationCap },
          { label: 'Students', href: '/teacher/students', icon: User },
          { label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 }
        ];
      case 'corporate':
        return [
          ...baseItems,
          { label: 'Employees', href: '/corporate/employees', icon: User },
          { label: 'Security Tools', href: '/corporate/tools', icon: Shield },
          { label: 'Analytics', href: '/corporate/analytics', icon: BarChart3 }
        ];
      default:
        return baseItems;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userCoins');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('userXP');
    localStorage.removeItem('selectedClass');
    router.push('/auth/login');
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.type === 'assignment') {
      router.push('/student/assignments');
    } else if (notification.type === 'grade') {
      router.push('/student/grades');
    }
    setIsNotificationsOpen(false);
  };

  const navItems = getNavItems();

  // XP bar calculation  
  const xpToNextLevel = userLevel * 1000;
  const xpProgress = (userXP % xpToNextLevel) / xpToNextLevel * 100;

  const renderDropdown = (type: string, isOpen: boolean, items: any[]) => {
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 mt-1 w-80 bg-black/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden z-50"
      >
        {items.map((item, index) => (
          <button
            key={item.href}
            onClick={() => {
              router.push(item.href);
              setIsLearningHubOpen(false);
              setIsCosmeticOpen(false);
            }}
            className="w-full flex items-start space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-500/20 transition-all duration-200 border-b border-gray-800/50 last:border-b-0"
          >
            <item.icon className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-gray-400 mt-1 leading-relaxed">{item.description}</div>
            </div>
          </button>
        ))}
      </motion.div>
    );
  };

  const renderNotifications = () => {
    if (!isNotificationsOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full right-0 mt-1 w-96 bg-black/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden z-50"
      >
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificationItems.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className="w-full flex items-start space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-500/20 transition-all duration-200 border-b border-gray-800/50 last:border-b-0"
            >
              <div className="flex-shrink-0 mt-1">
                {notification.type === 'assignment' ? (
                  <ClipboardList className="h-4 w-4 text-orange-400" />
                ) : (
                  <Award className="h-4 w-4 text-green-400" />
                )}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400 font-medium">{notification.courseCode}</span>
                  <span className="text-xs text-gray-500">{notification.teacherName}</span>
                </div>
                <div className="text-sm font-medium mt-1">{notification.title}</div>
                {notification.type === 'assignment' && notification.deadline && (
                  <div className="text-xs text-red-400 mt-1">{notification.deadline}</div>
                )}
                {notification.type === 'grade' && notification.grade && (
                  <div className="text-xs text-green-400 mt-1">
                    Grade: {notification.grade}/{notification.maxPoints}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderAppsMenu = () => {
    if (!isAppsMenuOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute top-full right-0 mt-3 w-96 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-blue-400" />
            Quick Access
          </h3>
          <p className="text-sm text-gray-400 mt-1">Navigate to any part of CyberSkill</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {appMenuItems.map((app) => (
              <motion.button
                key={app.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  router.push(app.href);
                  setIsAppsMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-br hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-200 group border border-transparent hover:border-gray-600/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-600/50 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-200">
                  <app.icon className={`h-6 w-6 ${app.color} group-hover:scale-110 transition-transform duration-200`} />
                </div>
                <span className="text-xs text-gray-300 font-medium text-center group-hover:text-white transition-colors">{app.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700/50 text-center">
          <p className="text-xs text-gray-500">Click outside to close</p>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
              <div className="h-4 w-32 bg-gray-600 rounded"></div>
            </div>
            <div className="animate-pulse flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-600 rounded"></div>
              <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
              <Shield className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">CyberSkill</h1>
              <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
            </div>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item, index) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <div
                    ref={item.dropdownType === 'learning' ? learningHubRef : item.dropdownType === 'cosmetic' ? cosmeticRef : null}
                    className="relative"
                    onMouseEnter={() => {
                      if (item.dropdownType === 'learning') setIsLearningHubOpen(true);
                      if (item.dropdownType === 'cosmetic') setIsCosmeticOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.dropdownType === 'learning') setIsLearningHubOpen(false);
                      if (item.dropdownType === 'cosmetic') setIsCosmeticOpen(false);
                    }}
                  >
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-4 py-3 rounded-xl hover:bg-blue-500/10 whitespace-nowrap"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </motion.button>
                    
                    <AnimatePresence>
                      {item.dropdownType === 'learning' && renderDropdown('learning', isLearningHubOpen, learningHubItems)}
                      {item.dropdownType === 'cosmetic' && renderDropdown('cosmetic', isCosmeticOpen, cosmeticItems)}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => router.push(item.href)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-4 py-3 rounded-xl hover:bg-blue-500/10 whitespace-nowrap"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          {/* User Info & Profile */}
          <div className="flex items-center space-x-4">
            {/* User Stats for Students */}
            {user?.role === 'student' && (
              <div className="hidden lg:flex items-center space-x-3">
                {/* Coins */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Gem className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">{userCoins.toLocaleString()}</span>
                </div>
                
                {/* Level & XP */}
                <div className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl min-w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Lv.{userLevel}</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Universal Apps Menu */}
            <div className="relative" ref={appsMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAppsMenuOpen(!isAppsMenuOpen)}
                className="relative p-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-blue-500/10"
                title="Quick Access"
              >
                <Grid3x3 className="h-6 w-6" />
              </motion.button>

              <AnimatePresence>
                {renderAppsMenu()}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-blue-500/10"
              >
                <Bell className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </motion.button>

              <AnimatePresence>
                {renderNotifications()}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-blue-500/10"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-1 w-64 bg-black/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        router.push('/student/profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-500/20 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/student/settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-500/20 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-700"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        if (!item.hasDropdown) {
                          router.push(item.href);
                          setIsMenuOpen(false);
                        }
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 transition-colors rounded-lg"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                    
                    {/* Mobile dropdown items */}
                    {item.hasDropdown && (
                      <div className="ml-6 space-y-1 border-l border-gray-700 pl-4">
                        {item.dropdownType === 'learning' && learningHubItems.map((subItem) => (
                          <button
                            key={subItem.href}
                            onClick={() => {
                              router.push(subItem.href);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <subItem.icon className="h-3 w-3" />
                            <span className="text-xs">{subItem.label}</span>
                          </button>
                        ))}
                        {item.dropdownType === 'cosmetic' && cosmeticItems.map((subItem) => (
                          <button
                            key={subItem.href}
                            onClick={() => {
                              router.push(subItem.href);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <subItem.icon className="h-3 w-3" />
                            <span className="text-xs">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Click outside to close dropdowns */}
      {(isAppsMenuOpen || isNotificationsOpen || isProfileOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsAppsMenuOpen(false);
            setIsNotificationsOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}
    </nav>
  );
}

export default NavbarComponent;
export const Navbar = () => <NavbarComponent />; 
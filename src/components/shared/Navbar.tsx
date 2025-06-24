'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Shield, Bell, User, LogOut, Menu, X, 
  GraduationCap, Building2, Book, Target, 
  Trophy, Settings, HelpCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@/lib/types';

interface NavbarProps {
  user?: UserType | null;
  notifications?: number;
}

function NavbarComponent({ user: propUser, notifications = 0 }: NavbarProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(propUser || null);
  const router = useRouter();

  useEffect(() => {
    // If no user prop is provided, try to get from localStorage
    if (!propUser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  // Navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: 'Dashboard', href: `/${user.role}/dashboard`, icon: Target },
    ];

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          { label: 'Courses', href: '/student/courses', icon: Book },
          { label: 'AI Tools', href: '/student/tools', icon: Shield },
          { label: 'Progress', href: '/student/progress', icon: Trophy },
          { label: 'Internships', href: '/student/internships', icon: Building2 },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { label: 'Classes', href: '/teacher/classes', icon: GraduationCap },
          { label: 'Students', href: '/teacher/students', icon: User },
          { label: 'Analytics', href: '/teacher/analytics', icon: Trophy },
        ];
      case 'corporate':
        return [
          ...baseItems,
          { label: 'Employees', href: '/corporate/employees', icon: User },
          { label: 'Security Tools', href: '/corporate/tools', icon: Shield },
          { label: 'Analytics', href: '/corporate/analytics', icon: Trophy },
          { label: 'Internships', href: '/corporate/internships', icon: Building2 },
        ];
      default:
        return baseItems;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/auth/login');
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CyberSkill.AI</h1>
              <p className="text-xs text-muted-foreground capitalize">{user?.role} Platform</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(item.href)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  {notifications}
                </Badge>
              )}
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </motion.button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2"
                >
                  <button 
                    onClick={() => router.push('/student/settings')}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// Named export for use without props
export const Navbar = () => <NavbarComponent />;

// Default export for use with props
export default NavbarComponent; 
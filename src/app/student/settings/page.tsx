'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Palette, Monitor, User, Shield,
  ChevronLeft, Check, Zap, Eye, Volume2, Bell, Globe,
  Moon, Sun, Smartphone, Laptop, Desktop, Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface UserSettings {
  displayName: string;
  email: string;
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    courseReminders: boolean;
    achievementAlerts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showAchievements: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  performance: {
    animationsEnabled: boolean;
    autoSave: boolean;
    dataSaver: boolean;
  };
}

export default function SettingsPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    email: '',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      courseReminders: true,
      achievementAlerts: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: true
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    },
    performance: {
      animationsEnabled: true,
      autoSave: true,
      dataSaver: false
    }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { currentTheme, setTheme, themeId } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadSettings();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
    } else {
      // Initialize with user data
      setSettings(prev => ({
        ...prev,
        displayName: demoStudent.name,
        email: demoStudent.email
      }));
    }
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setHasChanges(false);
    toast.success('Settings saved successfully! ⚙️');
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setSettings(newSettings);
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    const defaultSettings: UserSettings = {
      displayName: demoStudent.name,
      email: demoStudent.email,
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        courseReminders: true,
        achievementAlerts: true
      },
      privacy: {
        profileVisibility: 'public',
        showProgress: true,
        showAchievements: true
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false,
        screenReader: false
      },
      performance: {
        animationsEnabled: true,
        autoSave: true,
        dataSaver: false
      }
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.success('Settings reset to defaults');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <Navbar user={user} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center" style={{ color: currentTheme.colors.text }}>
                <SettingsIcon className="h-8 w-8 mr-3" style={{ color: currentTheme.colors.accent }} />
                Settings & Preferences
              </h1>
              <p className="mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                Customize your CyberSkill.AI experience
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => router.push('/student/dashboard')}
                className={currentTheme.styles.buttonClass}
                style={{ 
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text 
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              {hasChanges && (
                <Button
                  onClick={saveSettings}
                  className={currentTheme.styles.buttonClass}
                  style={{ 
                    backgroundColor: currentTheme.colors.accent,
                    color: currentTheme.colors.background 
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme Selection */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                    <Palette className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                    Theme Selection
                  </CardTitle>
                  <CardDescription style={{ color: currentTheme.colors.textSecondary }}>
                    Choose a visual theme that suits your style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(themes).map((theme) => (
                      <motion.div
                        key={theme.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTheme(theme.id);
                          toast.success(`Switched to ${theme.name} theme! 🎨`);
                        }}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          themeId === theme.id 
                            ? `border-2` 
                            : 'border-transparent hover:border-opacity-50'
                        }`}
                        style={{ 
                          backgroundColor: theme.colors.surface,
                          borderColor: themeId === theme.id ? theme.colors.primary : 'transparent'
                        }}
                      >
                        {themeId === theme.id && (
                          <div 
                            className="absolute top-2 right-2 p-1 rounded-full"
                            style={{ backgroundColor: theme.colors.primary }}
                          >
                            <Check className="h-3 w-3" style={{ color: theme.colors.background }} />
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <h4 className="font-medium" style={{ color: theme.colors.text }}>
                            {theme.name}
                          </h4>
                          
                          {/* Color Preview */}
                          <div className="flex space-x-2">
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                          
                          {/* Mini Preview */}
                          <div 
                            className="p-3 rounded border"
                            style={{ 
                              backgroundColor: theme.colors.background,
                              borderColor: theme.colors.border 
                            }}
                          >
                            <div 
                              className="text-xs font-medium mb-1"
                              style={{ color: theme.colors.text }}
                            >
                              Preview
                            </div>
                            <div 
                              className="text-xs"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              Theme colors in action
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                    <User className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label style={{ color: currentTheme.colors.text }}>Display Name</Label>
                    <Input
                      value={settings.displayName}
                      onChange={(e) => updateSetting('displayName', e.target.value)}
                      className={currentTheme.styles.inputClass}
                      style={{ 
                        backgroundColor: currentTheme.colors.surface,
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label style={{ color: currentTheme.colors.text }}>Email Address</Label>
                    <Input
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      type="email"
                      className={currentTheme.styles.inputClass}
                      style={{ 
                        backgroundColor: currentTheme.colors.surface,
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: currentTheme.colors.text }}>
                    <Bell className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting(`notifications.${key}`, e.target.checked)}
                          className="rounded"
                          style={{ accentColor: currentTheme.colors.primary }}
                        />
                        <span style={{ color: currentTheme.colors.text }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Accessibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center" style={{ color: currentTheme.colors.text }}>
                    <Eye className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                    Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label style={{ color: currentTheme.colors.text }}>Font Size</Label>
                    <select
                      value={settings.accessibility.fontSize}
                      onChange={(e) => updateSetting('accessibility.fontSize', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded border"
                      style={{ 
                        backgroundColor: currentTheme.colors.surface,
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text
                      }}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  {['highContrast', 'reducedMotion', 'screenReader'].map((key) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.accessibility[key as keyof typeof settings.accessibility] as boolean}
                          onChange={(e) => updateSetting(`accessibility.${key}`, e.target.checked)}
                          className="rounded"
                          style={{ accentColor: currentTheme.colors.primary }}
                        />
                        <span className="text-sm" style={{ color: currentTheme.colors.text }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center" style={{ color: currentTheme.colors.text }}>
                    <Zap className="h-5 w-5 mr-2" style={{ color: currentTheme.colors.accent }} />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.performance).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting(`performance.${key}`, e.target.checked)}
                          className="rounded"
                          style={{ accentColor: currentTheme.colors.primary }}
                        />
                        <span className="text-sm" style={{ color: currentTheme.colors.text }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={resetToDefaults}
                    variant="outline"
                    className="w-full"
                    style={{ 
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text 
                    }}
                  >
                    Reset to Defaults
                  </Button>
                  
                  <Button
                    onClick={saveSettings}
                    className="w-full"
                    style={{ 
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.background 
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Settings
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
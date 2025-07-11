'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Mail, Settings, Sun, Moon, Save, 
  Shield, Bell, Eye, Lock, Key, ArrowLeft,
  Palette, Volume2, VolumeX, Globe, 
  Smartphone, Monitor, Trash2, Download,
  BookOpen, Target, Award, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { useTheme } from '@/contexts/ThemeContext';

interface UserSettings {
  profile: {
    name: string;
  email: string;
    avatar?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    soundEnabled: boolean;
    notifications: boolean;
    language: string;
  };
  privacy: {
    profileVisible: boolean;
    shareProgress: boolean;
    allowMessages: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
  };
}

export default function SettingsPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettings>({
    profile: { name: '', email: '' },
    preferences: {
      theme: 'dark',
      soundEnabled: true,
      notifications: true,
      language: 'English',
    },
    privacy: {
      profileVisible: false,
      shareProgress: true,
      allowMessages: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true
    }
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { appTheme, toggleAppTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        setSettings(prev => ({
          ...prev,
          profile: {
            name: demoStudent.name,
            email: demoStudent.email
          }
        }));
        loadUserSettings();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const loadUserSettings = () => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordForm.new.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Password updated successfully! 🎉');
    
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const exportData = () => {
    const data = {
      profile: settings.profile,
      preferences: settings.preferences,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cyberskil-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      setSettings({
        profile: { name: user?.name || '', email: user?.email || '' },
        preferences: {
          theme: 'dark',
          soundEnabled: true,
          notifications: true,
          language: 'English',
        },
        privacy: {
          profileVisible: false,
          shareProgress: true,
          allowMessages: true
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
          loginAlerts: true
        }
      });
      alert('Settings reset to default values');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'security', name: 'Security', icon: Lock }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
              <Button 
              onClick={() => router.push('/student/dashboard')}
                variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
              </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <p className="text-slate-400">Manage your profile, preferences, and security</p>
            </div>
            <Button
              onClick={saveSettings}
              disabled={saveStatus === 'saving'}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="kokonut-card bg-slate-900/50 sticky top-6">
              <CardContent className="p-4">
                <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                      <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
              );
            })}
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h3 className="text-slate-400 text-sm font-medium mb-3">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Profile</span>
                      <Badge className="bg-green-500/20 text-green-300">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Security</span>
                      <Badge className={settings.security.twoFactorEnabled ? "bg-green-500/20 text-green-300" : "bg-orange-500/20 text-orange-300"}>
                        {settings.security.twoFactorEnabled ? 'Secure' : 'Basic'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
                <Card className="kokonut-card bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      Profile Information
                  </CardTitle>
                    <CardDescription className="text-slate-400">
                      Update your personal details and avatar
                  </CardDescription>
                </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                                </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <p className="text-slate-400">{user.email}</p>
                        <Badge className="mt-1 bg-blue-500/20 text-blue-300">Student Account</Badge>
                                </div>
                                    <Button
                                      variant="outline"
                        className="ml-auto border-slate-600 text-slate-400 hover:bg-slate-800"
                      >
                        Change Avatar
                                    </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                        <Input
                          id="name"
                          value={settings.profile.name}
                          onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                                </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                                </div>
                              </div>

                    {/* Learning Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">12,847</div>
                        <div className="text-sm text-slate-400">Total XP</div>
                      </div>
                      <div className="text-center">
                        <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">23</div>
                        <div className="text-sm text-slate-400">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <Target className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">Level 8</div>
                        <div className="text-sm text-slate-400">Current Level</div>
                      </div>
                        </div>
                      </CardContent>
                    </Card>

                {/* Password Change */}
                <Card className="kokonut-card bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Key className="h-5 w-5 text-green-400" />
                      Change Password
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Update your account password for better security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Current Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">New Password</Label>
                        <Input
                          type="password"
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Confirm New Password</Label>
                        <Input
                          type="password"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handlePasswordChange}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
            </motion.div>
          )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
                <Card className="kokonut-card bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-400" />
                      Appearance & Theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Theme Mode</Label>
                        <p className="text-sm text-slate-400">Choose your preferred color scheme</p>
                      </div>
                      <div className="flex gap-2">
                        {(['light', 'dark', 'auto'] as const).map((theme) => (
                          <Button
                            key={theme}
                            variant={settings.preferences.theme === theme ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSetting('preferences', 'theme', theme)}
                            className={settings.preferences.theme === theme ? "bg-blue-500 hover:bg-blue-600" : "border-slate-600 text-slate-400"}
                          >
                            {theme === 'light' && <Sun className="h-4 w-4 mr-1" />}
                            {theme === 'dark' && <Moon className="h-4 w-4 mr-1" />}
                            {theme === 'auto' && <Monitor className="h-4 w-4 mr-1" />}
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </Button>
                        ))}
                      </div>
                  </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Sound Effects</Label>
                        <p className="text-sm text-slate-400">Enable audio feedback for interactions</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('preferences', 'soundEnabled', !settings.preferences.soundEnabled)}
                        className={`border-slate-600 ${settings.preferences.soundEnabled ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.preferences.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                  </div>
                  </CardContent>
                </Card>

                <Card className="kokonut-card bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-5 w-5 text-yellow-400" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Push Notifications</Label>
                        <p className="text-sm text-slate-400">Receive notifications about new content and achievements</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('preferences', 'notifications', !settings.preferences.notifications)}
                        className={`border-slate-600 ${settings.preferences.notifications ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.preferences.notifications ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
                <Card className="kokonut-card bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="h-5 w-5 text-cyan-400" />
                      Privacy Controls
                  </CardTitle>
                    <CardDescription className="text-slate-400">
                      Control who can see your information and activities
                  </CardDescription>
                </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Profile Visibility</Label>
                        <p className="text-sm text-slate-400">Make your profile visible to other students</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('privacy', 'profileVisible', !settings.privacy.profileVisible)}
                        className={`border-slate-600 ${settings.privacy.profileVisible ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.privacy.profileVisible ? 'Public' : 'Private'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Share Progress</Label>
                        <p className="text-sm text-slate-400">Allow others to see your learning achievements</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('privacy', 'shareProgress', !settings.privacy.shareProgress)}
                        className={`border-slate-600 ${settings.privacy.shareProgress ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.privacy.shareProgress ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Allow Messages</Label>
                        <p className="text-sm text-slate-400">Let other students send you messages</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('privacy', 'allowMessages', !settings.privacy.allowMessages)}
                        className={`border-slate-600 ${settings.privacy.allowMessages ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.privacy.allowMessages ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="kokonut-card bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Download className="h-5 w-5 text-blue-400" />
                      Data Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Export Data</Label>
                        <p className="text-sm text-slate-400">Download a copy of your account data</p>
                      </div>
                      <Button
                        onClick={exportData}
                        variant="outline"
                        className="border-slate-600 text-slate-400 hover:bg-slate-800"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Reset Settings</Label>
                        <p className="text-sm text-slate-400">Restore all settings to default values</p>
                      </div>
                      <Button
                        onClick={resetSettings}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                          </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="kokonut-card bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Protect your account with advanced security features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Two-Factor Authentication</Label>
                        <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                        className={`border-slate-600 ${settings.security.twoFactorEnabled ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Login Alerts</Label>
                        <p className="text-sm text-slate-400">Get notified of new login attempts</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('security', 'loginAlerts', !settings.security.loginAlerts)}
                        className={`border-slate-600 ${settings.security.loginAlerts ? 'text-green-400 border-green-500' : 'text-slate-400'}`}
                      >
                        {settings.security.loginAlerts ? 'Enabled' : 'Disabled'}
                      </Button>
                          </div>
                          
                    <div className="space-y-2">
                      <Label className="text-slate-300">Session Timeout</Label>
                      <p className="text-sm text-slate-400">Automatically log out after inactivity</p>
                      <div className="flex gap-2">
                        {[15, 30, 60, 120].map((minutes) => (
                          <Button
                            key={minutes}
                            variant={settings.security.sessionTimeout === minutes ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSetting('security', 'sessionTimeout', minutes)}
                            className={settings.security.sessionTimeout === minutes ? "bg-blue-500 hover:bg-blue-600" : "border-slate-600 text-slate-400"}
                          >
                            {minutes}m
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="kokonut-card bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                            </div>
                      <div>
                        <h3 className="font-semibold text-green-300 mb-1">Account Security Score</h3>
                        <p className="text-green-200 text-sm">Your account security is looking good! 🎉</p>
                            </div>
                          </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-300 text-sm">Security Level</span>
                        <span className="text-green-300 text-sm">85%</span>
                        </div>
                      <Progress value={85} className="h-2 bg-slate-800" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}
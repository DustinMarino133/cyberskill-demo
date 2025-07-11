'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Lock, Palette, Monitor, 
  Shield, Save, Mail, Phone, Globe, Book,
  GraduationCap, Users, Clock, Calendar,
  Eye, EyeOff, Volume2, VolumeX, Smartphone,
  Laptop, Desktop, AlertTriangle, Check,
  ArrowLeft, Building, MapPin, Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  employeeId: string;
  officeLocation: string;
  teachingExperience: number;
  subjects: string[];
  preferredLanguage: string;
  timezone: string;
}

export default function TeacherSettings() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<TeacherProfile>({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@cyberskill.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science & Cybersecurity',
    employeeId: 'CS-2024-001',
    officeLocation: 'Technology Building, Room 234',
    teachingExperience: 8,
    subjects: ['Advanced Cybersecurity', 'Network Security', 'Digital Forensics'],
    preferredLanguage: 'English',
    timezone: 'America/New_York'
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    gradeNotifications: true,
    classUpdates: true,
    systemMaintenance: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowStudentMessages: true,
    shareContactInfo: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    soundEnabled: true,
    autoSave: true,
    defaultGradeScale: '100-point',
    assignmentReminders: '24-hours'
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'teacher') {
        setUser({ ...userData, name: 'Sarah Johnson' });
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleProfileUpdate = (field: keyof TeacherProfile, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [setting]: value }));
    setUnsavedChanges(true);
  };

  const handlePrivacyChange = (setting: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [setting]: value }));
    setUnsavedChanges(true);
  };

  const handlePreferenceChange = (setting: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [setting]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', { profile, notifications, privacy, preferences });
    setUnsavedChanges(false);
    
    // Show success message
    alert('Settings saved successfully!');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // In a real app, this would validate current password and update
    console.log('Changing password...');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordChange(false);
    alert('Password changed successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
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
              onClick={() => router.push('/teacher/dashboard')}
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Teacher Settings</h1>
              <p className="text-slate-400">Manage your account and teaching preferences</p>
            </div>
          </div>

          {/* Save Changes Bar */}
          {unsavedChanges && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Unsaved Changes</p>
                    <p className="text-orange-300 text-sm">You have unsaved changes to your settings</p>
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your professional information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeId" className="text-slate-300">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={profile.employeeId}
                        onChange={(e) => handleProfileUpdate('employeeId', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="department" className="text-slate-300">Department</Label>
                      <Input
                        id="department"
                        value={profile.department}
                        onChange={(e) => handleProfileUpdate('department', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="office" className="text-slate-300">Office Location</Label>
                      <Input
                        id="office"
                        value={profile.officeLocation}
                        onChange={(e) => handleProfileUpdate('officeLocation', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-400" />
                    Security & Privacy
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-slate-400 text-sm">Update your account password</p>
                    </div>
                    <Button
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      {showPasswordChange ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {showPasswordChange ? 'Cancel' : 'Change'}
                    </Button>
                  </div>

                  {showPasswordChange && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 border-t border-slate-700 pt-4"
                    >
                      <div>
                        <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      <Button
                        onClick={handlePasswordChange}
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </motion.div>
                  )}

                  {/* Privacy Settings */}
                  <div className="space-y-4 border-t border-slate-700 pt-4">
                    <h4 className="text-white font-medium">Privacy Settings</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">Show Online Status</p>
                          <p className="text-slate-500 text-xs">Let students see when you're online</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrivacyChange('showOnlineStatus', !privacy.showOnlineStatus)}
                          className={`${privacy.showOnlineStatus ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}`}
                        >
                          {privacy.showOnlineStatus ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">Allow Student Messages</p>
                          <p className="text-slate-500 text-xs">Students can send you direct messages</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrivacyChange('allowStudentMessages', !privacy.allowStudentMessages)}
                          className={`${privacy.allowStudentMessages ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}`}
                        >
                          {privacy.allowStudentMessages ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-400" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                      { key: 'assignmentReminders', label: 'Assignment Reminders', desc: 'Reminders about assignment deadlines' },
                      { key: 'gradeNotifications', label: 'Grade Notifications', desc: 'Notifications when students submit work' },
                      { key: 'classUpdates', label: 'Class Updates', desc: 'Updates about your classes and students' },
                      { key: 'systemMaintenance', label: 'System Maintenance', desc: 'Important system updates and maintenance alerts' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300 font-medium">{setting.label}</p>
                          <p className="text-slate-500 text-sm">{setting.desc}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotificationChange(setting.key, !notifications[setting.key as keyof typeof notifications])}
                          className={`${notifications[setting.key as keyof typeof notifications] ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}`}
                        >
                          {notifications[setting.key as keyof typeof notifications] ? (
                            <><Check className="mr-1 h-3 w-3" /> On</>
                          ) : (
                            'Off'
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Teaching Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                    Teaching Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Experience:</span>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      {profile.teachingExperience} years
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-slate-300 block mb-2">Subjects:</span>
                    <div className="space-y-1">
                      {profile.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="border-slate-600 text-slate-300 block">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-300 block mb-2">Quick Stats:</span>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Classes:</span>
                        <span className="text-white">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Students:</span>
                        <span className="text-white">72</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Grade:</span>
                        <span className="text-green-400">85%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-cyan-400" />
                    System Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300">Dark Mode</p>
                      <p className="text-slate-500 text-xs">Use dark theme</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
                      className={`${preferences.darkMode ? 'border-blue-500 text-blue-400' : 'border-slate-600 text-slate-400'}`}
                    >
                      {preferences.darkMode ? 'On' : 'Off'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300">Sound Effects</p>
                      <p className="text-slate-500 text-xs">System sounds</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}
                      className={`${preferences.soundEnabled ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}`}
                    >
                      {preferences.soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300">Auto-save</p>
                      <p className="text-slate-500 text-xs">Automatically save changes</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreferenceChange('autoSave', !preferences.autoSave)}
                      className={`${preferences.autoSave ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}`}
                    >
                      {preferences.autoSave ? 'On' : 'Off'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => router.push('/teacher/classroom')}
                    variant="outline"
                    className="w-full justify-start border-green-500/30 text-green-300 hover:bg-green-500/10"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Go to Classroom
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/teacher/quiz-builder')}
                    variant="outline"
                    className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Book className="mr-2 h-4 w-4" />
                    Create Quiz
                  </Button>

                  <Button
                    onClick={() => router.push('/teacher/dashboard')}
                    variant="outline"
                    className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Save Button - Fixed Bottom */}
        {unsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-2xl"
            >
              <Save className="mr-2 h-5 w-5" />
              Save All Changes
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
} 
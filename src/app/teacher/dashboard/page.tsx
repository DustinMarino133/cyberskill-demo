'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Brain, MessageSquare, FileText,
  Clock, ChevronRight, Target, Award, Plus,
  Sparkles, Star, Calendar, CheckCircle,
  AlertCircle, Timer, CalendarDays, User,
  GraduationCap, Settings, FlaskConical, BarChart3,
  TrendingUp, Edit, Eye, Send, Upload, Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';

interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  priority: 'normal' | 'important' | 'urgent';
  pinned?: boolean;
}

interface Student {
  id: string;
  name: string;
  email: string;
  averageScore: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  status: 'active' | 'struggling' | 'inactive';
}

interface Assignment {
  id: string;
  title: string;
  type: 'quiz' | 'lab' | 'project';
  dueDate: string;
  submissions: number;
  totalStudents: number;
  averageScore: number;
  status: 'draft' | 'published' | 'closed';
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<'overview' | 'announcements' | 'assignments' | 'student-grades'>('overview');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date(2025, 6, 1)); // July 2025
  const router = useRouter();

  // Teacher Tools Menu Items
  const teacherToolsItems = [
    { label: 'Create Quiz', href: '/teacher/quiz-builder', icon: FileText, color: 'text-blue-400' },
    { label: 'AI Assistant', href: '/teacher/ai-assistant', icon: Brain, color: 'text-purple-400' },
    { label: 'Post Announcement', href: '/teacher/announcements', icon: MessageSquare, color: 'text-green-400' },
    { label: 'Student Grades', href: '/teacher/grades', icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Assign Lab', href: '/teacher/labs', icon: FlaskConical, color: 'text-orange-400' },
    { label: 'Class Analytics', href: '/teacher/analytics', icon: TrendingUp, color: 'text-yellow-400' },
    { label: 'Classroom', href: '/teacher/classroom', icon: Users, color: 'text-pink-400' },
    { label: 'Settings', href: '/teacher/settings', icon: Settings, color: 'text-gray-400' },
    { label: 'Upload Materials', href: '/teacher/materials', icon: Upload, color: 'text-indigo-400' }
  ];

  // Mock data for teacher dashboard
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Network Security Quiz - Tomorrow',
      content: 'Reminder: Network Security Assessment is due tomorrow at 11:59 PM. 18 out of 24 students have submitted.',
      timestamp: '2 hours ago',
      priority: 'important',
      pinned: true
    },
    {
      id: '2',
      title: 'New Lab Materials Available',
      content: 'Digital Forensics lab materials have been uploaded. Students can now access the virtual environment.',
      timestamp: '1 day ago',
      priority: 'normal'
    },
    {
      id: '3',
      title: 'Parent-Teacher Conferences',
      content: 'Scheduled for next week. Please review student progress reports before meetings.',
      timestamp: '2 days ago',
      priority: 'normal'
    }
  ];

  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Chen',
      email: 'alex.chen@school.edu',
      averageScore: 85,
      assignmentsCompleted: 8,
      totalAssignments: 10,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson', 
      email: 'sarah.j@school.edu',
      averageScore: 92,
      assignmentsCompleted: 10,
      totalAssignments: 10,
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'mike.r@school.edu',
      averageScore: 67,
      assignmentsCompleted: 6,
      totalAssignments: 10,
      status: 'struggling'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@school.edu',
      averageScore: 88,
      assignmentsCompleted: 9,
      totalAssignments: 10,
      status: 'active'
    }
  ];

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Network Security Quiz',
      type: 'quiz',
      dueDate: 'Tomorrow',
      submissions: 18,
      totalStudents: 24,
      averageScore: 84,
      status: 'published'
    },
    {
      id: '2',
      title: 'Firewall Configuration Lab',
      type: 'lab',
      dueDate: 'Feb 5',
      submissions: 12,
      totalStudents: 24,
      averageScore: 78,
      status: 'published'
    },
    {
      id: '3',
      title: 'Cryptography Project',
      type: 'project',
      dueDate: 'Feb 15',
      submissions: 0,
      totalStudents: 24,
      averageScore: 0,
      status: 'draft'
    }
  ];

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

  const teachingActions = [
    {
      title: 'Create Assignment',
      description: 'Design new quizzes and labs',
      icon: Plus,
      action: () => router.push('/teacher/create-assignment'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AI Teaching Assistant',
      description: 'Get help with curriculum planning',
      icon: Brain,
      action: () => router.push('/teacher/ai-assistant'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Post Announcement',
      description: 'Update students on class news',
      icon: MessageSquare,
      action: () => setCurrentTab('announcements'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Grade Assignments',
      description: 'Review and grade submissions',
      icon: CheckCircle,
      action: () => setCurrentTab('student-grades'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getAnnouncementColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500/50 bg-red-500/10';
      case 'important': return 'border-orange-500/50 bg-orange-500/10';
      default: return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'struggling': return 'text-red-400';
      case 'inactive': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getAssignmentIcon = (type: string) => {
    switch (type) {
      case 'quiz': return FileText;
      case 'lab': return FlaskConical;
      case 'project': return Target;
      default: return FileText;
    }
  };

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

    return (
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Class Calendar</h3>
          </div>
        </div>
        
        <div className="text-center mb-3">
          <p className="text-xs text-gray-300 font-medium">
            {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6"
        >
              <div className="flex items-center justify-between">
                <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome back, Sarah Johnson! 👋
              </h1>
              <p className="text-gray-400">
                Your CS6-2024 Advanced Cybersecurity class is ready for today's session.
              </p>
                </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">24</div>
                <div className="text-gray-400 text-sm">Students</div>
                </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-white" />
              <span>Recent Announcements</span>
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentTab('announcements')}
              className="text-blue-400 hover:text-blue-300"
            >
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <Card 
                key={announcement.id}
                className={`bg-gradient-to-br backdrop-blur-md border transition-all duration-200 hover:border-blue-400/40 ${getAnnouncementColor(announcement.priority)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{announcement.title}</h3>
                        {announcement.pinned && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            Pinned
                          </Badge>
                        )}
                        <Badge className={`text-xs ${
                          announcement.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          announcement.priority === 'important' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{announcement.content}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{announcement.timestamp}</span>
                        </span>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </motion.div>

        {/* Teaching Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Teaching Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachingActions.map((action, index) => (
              <Card 
                key={index}
                className="backdrop-blur-md border-blue-500/20 cursor-pointer transition-all duration-200 hover:border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                onClick={action.action}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-20`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                <div>
                      <CardTitle className="text-lg text-white">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
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

        {/* Class Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Class Overview</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Students:</span>
                <span className="text-white font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Class Average:</span>
                <span className="text-green-400 font-medium">83%</span>
                </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Assignments:</span>
                <span className="text-blue-400 font-medium">10 Active</span>
                </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Submissions:</span>
                <span className="text-yellow-400 font-medium">18 Pending</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Quick Access</h3>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={() => setCurrentTab('student-grades')}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/20"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Student Grades
              </Button>
              <Button
                onClick={() => setCurrentTab('assignments')}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                Assignments
              </Button>
              <Button
                onClick={() => router.push('/teacher/classroom')}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/20"
              >
                <Users className="h-4 w-4 mr-2" />
                Classroom
                    </Button>
                  </div>
                </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Class Announcements</h2>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {announcements.map((announcement) => (
        <motion.div
          key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
            <div className="flex items-center gap-2">
              {announcement.pinned && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Pinned
                </Badge>
              )}
              <Badge className={`${
                announcement.priority === 'urgent' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                announcement.priority === 'important' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}>
                {announcement.priority.toUpperCase()}
                      </Badge>
                      </div>
          </div>
          
          <p className="text-gray-300 mb-4">{announcement.content}</p>
          <p className="text-gray-500 text-sm">{announcement.timestamp}</p>
        </motion.div>
      ))}
    </div>
  );

  const renderAssignments = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Assignments</h2>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const IconComponent = getAssignmentIcon(assignment.type);
          return (
            <Card 
            key={assignment.id}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50"
          >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      assignment.type === 'quiz' ? 'bg-blue-500/20' : 
                      assignment.type === 'lab' ? 'bg-green-500/20' : 'bg-purple-500/20'
                    }`}>
                      <IconComponent className={`h-5 w-5 ${
                        assignment.type === 'quiz' ? 'text-blue-400' : 
                        assignment.type === 'lab' ? 'text-green-400' : 'text-purple-400'
                      }`} />
                    </div>
                  <div>
                      <h3 className="text-white font-medium">{assignment.title}</h3>
                      <p className="text-gray-400 text-sm">
                        Due: {assignment.dueDate} • {assignment.submissions}/{assignment.totalStudents} submitted
                        {assignment.averageScore > 0 && ` • Avg: ${assignment.averageScore}%`}
                      </p>
                </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      assignment.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                      assignment.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}>
                      {assignment.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                  </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStudentGrades = () => (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Student Grades</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">24</div>
            <div className="text-white text-sm">Total Students</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">83%</div>
            <div className="text-white text-sm">Class Average</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">1</div>
            <div className="text-white text-sm">Need Help</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">95%</div>
            <div className="text-white text-sm">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
          <CardTitle className="text-white">Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                    <div>
                      <h3 className="text-white font-medium">{student.name}</h3>
                      <p className="text-gray-400 text-sm">{student.email}</p>
              </div>
                </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{student.averageScore}%</div>
                      <div className="text-xs text-gray-400">Average</div>
              </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{student.assignmentsCompleted}/{student.totalAssignments}</div>
                      <div className="text-xs text-gray-400">Completed</div>
                </div>
                    <Badge className={`${getStudentStatusColor(student.status)} border-current bg-current/10`}>
                      {student.status}
                    </Badge>
              </div>
                </div>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user as any} />

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'announcements', label: 'Announcements', icon: MessageSquare },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'student-grades', label: 'Student Grades', icon: BarChart3 }
            ].map((tab) => (
            <button
              key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium text-sm
                  ${currentTab === tab.id 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800/50'
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'overview' && renderOverview()}
        {currentTab === 'announcements' && renderAnnouncements()}
        {currentTab === 'assignments' && renderAssignments()}
        {currentTab === 'student-grades' && renderStudentGrades()}
      </div>
    </div>
  );
}

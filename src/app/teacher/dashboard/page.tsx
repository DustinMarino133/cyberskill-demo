'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, Trophy, TrendingUp, AlertTriangle, Calendar, 
  Plus, Eye, Edit, Send, BarChart3, GraduationCap, Star, Clock,
  Target, CheckCircle, XCircle, Activity, Award, Zap, Brain,
  Shield, Sparkles, FileText, MessageSquare, Settings, Filter,
  Search, Bell, ChevronDown, ChevronRight, TrendingDown, Flame,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/shared/Navbar';
import { demoClassroomStudents, demoAssignments, demoClassAnalytics } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = ['#536DE2', '#00D4FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'students', label: 'Students', icon: Users, color: 'from-purple-500 to-pink-500' },
    { id: 'assignments', label: 'Assignments', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ];

  const quickActions = [
    {
      title: 'Create Assignment',
      description: 'Design new cybersecurity challenges',
      icon: Plus,
      color: 'from-blue-500 to-purple-600',
      action: () => console.log('Create assignment')
    },
    {
      title: 'AI Course Builder',
      description: 'Generate courses with AI assistance',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      action: () => console.log('AI course builder')
    },
    {
      title: 'Send Announcement',
      description: 'Notify students about updates',
      icon: MessageSquare,
      color: 'from-green-500 to-teal-600',
      action: () => console.log('Send announcement')
    },
    {
      title: 'Generate Report',
      description: 'Export class performance data',
      icon: FileText,
      color: 'from-orange-500 to-red-600',
      action: () => console.log('Generate report')
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="kokonut-card bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50"
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10"></div>
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {currentUser?.name || 'Professor'}! 
                  <span className="ml-2">👋</span>
                </h1>
                <p className="text-slate-300 text-lg">
                  Your cybersecurity classroom is thriving. Here's today's overview.
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400">{demoClassAnalytics.totalStudents}</div>
                  <div className="text-slate-400 text-sm">Total Students</div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={action.action}
          >
            <Card className="kokonut-card h-full border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {action.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="kokonut-card border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">Active Students</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{demoClassAnalytics.activeStudents}</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      +3 today
                    </Badge>
                  </div>
                  <p className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    82% engagement rate
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Activity className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="kokonut-card border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">Average Grade</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{demoClassAnalytics.averageGrade}%</p>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      +2% this week
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-400 flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    Above class average
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Trophy className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="kokonut-card border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">Assignments Due</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{demoAssignments.filter(a => a.status === 'active').length}</p>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                      This week
                    </Badge>
                  </div>
                  <p className="text-sm text-orange-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Review pending
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl">
                  <BookOpen className="h-8 w-8 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="kokonut-card border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">Course Completion</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{demoClassAnalytics.coursesCompleted}</p>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      +12 this month
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-400 flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Excellent progress
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Award className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="kokonut-card border-slate-700">
          <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Weekly Engagement
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Student activity and study hours
                  </CardDescription>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Live Data
                </Badge>
              </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={demoClassAnalytics.weeklyEngagement}>
                  <defs>
                    <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#536DE2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#536DE2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                      borderRadius: '12px',
                      color: '#F9FAFB',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#536DE2" 
                    fillOpacity={1} 
                    fill="url(#studentsGradient)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#00D4FF" 
                    fillOpacity={1} 
                    fill="url(#hoursGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="kokonut-card border-slate-700">
          <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    Grade Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Class performance breakdown
                  </CardDescription>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Current Term
                </Badge>
              </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demoClassAnalytics.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                  dataKey="count"
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                    labelLine={false}
                >
                  {demoClassAnalytics.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      color: '#F9FAFB'
                    }} 
                  />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="kokonut-card border-slate-700">
          <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
              Top Performers
            </CardTitle>
              <CardDescription className="text-slate-400">
                Students excelling this week
              </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoClassAnalytics.topPerformers.map((student, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">#{index + 1}</span>
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Crown className="h-2 w-2 text-yellow-900" />
                          </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{student.name}</div>
                        <div className="text-sm text-slate-400">{student.score}% average</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${index === 0 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                        {student.improvement}
                  </Badge>
                      <Flame className="h-4 w-4 text-orange-400" />
                </div>
                  </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="kokonut-card border-slate-700">
          <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              Students Needing Support
            </CardTitle>
              <CardDescription className="text-slate-400">
                Students who may need additional help
              </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoClassAnalytics.strugglingStudents.map((student, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/20 hover:border-red-500/30 transition-colors"
                  >
                                          <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{student.name.charAt(0)}</span>
                        </div>
                  <div>
                          <div className="font-semibold text-white">{student.name}</div>
                          <div className="text-sm text-slate-400">{student.lastActive}</div>
                        </div>
                  </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      {student.score}%
                    </Badge>
                      <Button size="sm" variant="outline" className="border-red-500/30 text-red-300 hover:bg-red-500/10">
                        Help
                    </Button>
                  </div>
                  </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Student Management</h2>
          <p className="text-slate-400">Monitor progress and support your students</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 w-64"
            />
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Filter className="h-4 w-4 mr-2" />
            Filter
        </Button>
      </div>
      </motion.div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoClassroomStudents.map((student, index) => (
          <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
                  >
            <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                      <h3 className="font-semibold text-white">{student.name}</h3>
                      <p className="text-sm text-slate-400">{student.email}</p>
                        </div>
                      </div>
                  <Badge className={`${student.progress >= 80 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                    student.progress >= 60 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 
                    'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                    {student.progress}%
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Course Progress</span>
                      <span className="text-white">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Assignments</span>
                      <div className="text-white font-semibold">{student.assignmentsCompleted}/12</div>
                    </div>
                      <div>
                      <span className="text-slate-400">Last Active</span>
                      <div className="text-white font-semibold">{student.lastActive}</div>
                      </div>
                      </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                        </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                        </Button>
                      </div>
          </div>
        </CardContent>
      </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Assignment Management</h2>
          <p className="text-slate-400">Create, manage, and track student assignments</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {demoAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{assignment.title}</CardTitle>
                  <Badge className={`${
                    assignment.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    assignment.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}>
                    {assignment.status}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">
                  Due: {assignment.dueDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">{assignment.description}</p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Submissions</span>
                  <span className="text-white">{assignment.submitted}/{assignment.totalStudents}</span>
                </div>
                <Progress value={(assignment.submitted / assignment.totalStudents) * 100} className="h-2" />

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
        <p className="text-slate-400">Deep insights into student performance and engagement</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="kokonut-card border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Track student improvement over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={demoClassAnalytics.performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="average" stroke="#536DE2" strokeWidth={3} dot={{ fill: '#536DE2', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="top10" stroke="#00D4FF" strokeWidth={2} dot={{ fill: '#00D4FF', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="kokonut-card border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Skill Assessment</CardTitle>
            <CardDescription className="text-slate-400">
              Student proficiency by cybersecurity domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demoClassAnalytics.skillAssessment} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="skill" type="category" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="proficiency" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      
      <Navbar user={currentUser} />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 p-2 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'analytics' && renderAnalytics()}
        </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

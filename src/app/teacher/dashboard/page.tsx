'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Trophy, TrendingUp, AlertTriangle, Calendar, 
  Plus, Eye, Edit, Send, BarChart3, GraduationCap, Star, Clock,
  Target, CheckCircle2, XCircle, Activity, Award, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shared/Navbar';
import { demoClassroomStudents, demoAssignments, demoClassAnalytics } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#536DE2', '#00D4FF', '#8B5CF6', '#10B981', '#F59E0B'];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const tabs = [
    { id: 'overview', label: 'Class Overview', icon: BarChart3 },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">{demoClassAnalytics.totalStudents}</p>
                  <p className="text-sm text-cyber-green">+3 from last week</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
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
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-3xl font-bold text-foreground">{demoClassAnalytics.activeStudents}</p>
                  <p className="text-sm text-cyber-green">82% engagement</p>
                </div>
                <div className="p-3 bg-cyber-green/10 rounded-full">
                  <Activity className="h-6 w-6 text-cyber-green" />
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
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                  <p className="text-3xl font-bold text-foreground">{demoClassAnalytics.averageGrade}%</p>
                  <p className="text-sm text-cyber-blue">+2% improvement</p>
                </div>
                <div className="p-3 bg-cyber-blue/10 rounded-full">
                  <Trophy className="h-6 w-6 text-cyber-blue" />
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
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                  <p className="text-3xl font-bold text-foreground">{demoClassAnalytics.coursesCompleted}</p>
                  <p className="text-sm text-cyber-purple">+12 this week</p>
                </div>
                <div className="p-3 bg-cyber-purple/10 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-cyber-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Engagement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Student Engagement</CardTitle>
            <CardDescription>Active students and study hours by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demoClassAnalytics.weeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="students" fill="#536DE2" name="Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hours" fill="#00D4FF" name="Hours" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-foreground">Grade Distribution</CardTitle>
            <CardDescription>Class performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demoClassAnalytics.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                >
                  {demoClassAnalytics.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers and At-Risk Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-cyber-blue" />
              Top Performers
            </CardTitle>
            <CardDescription>Students excelling in the program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoClassAnalytics.topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyber-blue/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-cyber-blue">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Level {student.level}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-cyber-blue/20 text-cyber-blue">
                    {student.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Students Needing Support
            </CardTitle>
            <CardDescription>Students who may need additional help</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoClassAnalytics.strugglingStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Last active: {student.lastActive}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                      {student.score}%
                    </Badge>
                    <Button size="sm" variant="outline" className="ml-2">
                      Send Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Student Management</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card className="cyber-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Grade</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Level/XP</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Streak</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Avg Score</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Last Active</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoClassroomStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-border/50 hover:bg-background/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{student.grade}</Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">Level {student.level}</p>
                        <p className="text-sm text-muted-foreground">{student.xp.toLocaleString()} XP</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-cyber-blue" />
                        <span className="font-medium text-foreground">{student.streak}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          student.averageScore >= 90 ? 'bg-cyber-green/20 text-cyber-green' :
                          student.averageScore >= 80 ? 'bg-cyber-blue/20 text-cyber-blue' :
                          'bg-orange-500/20 text-orange-500'
                        }`}
                      >
                        {student.averageScore}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {student.lastActive.toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assignment Management</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-6">
        {demoAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">{assignment.title}</CardTitle>
                    <CardDescription>{assignment.description}</CardDescription>
                  </div>
                  <Badge 
                    variant={assignment.status === 'active' ? 'default' : 'secondary'}
                    className={assignment.status === 'active' ? 'bg-cyber-green/20 text-cyber-green' : ''}
                  >
                    {assignment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{assignment.course}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Due: {assignment.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {assignment.studentsCompleted}/{assignment.studentsAssigned} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Avg: {assignment.averageScore}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion Progress</span>
                    <span className="text-foreground">
                      {Math.round((assignment.studentsCompleted / assignment.studentsAssigned) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(assignment.studentsCompleted / assignment.studentsAssigned) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {assignment.status === 'draft' && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Send className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  )}
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
      <h2 className="text-2xl font-bold text-foreground">Class Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-foreground">Learning Progress Trends</CardTitle>
            <CardDescription>XP earned over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={demoClassAnalytics.weeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#536DE2" 
                  strokeWidth={3}
                  dot={{ fill: '#536DE2', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-foreground">Class Performance Metrics</CardTitle>
            <CardDescription>Key indicators at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total XP Earned</span>
                  <span className="text-sm font-medium text-foreground">
                    {demoClassAnalytics.totalXPEarned.toLocaleString()}
                  </span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Badges Earned</span>
                  <span className="text-sm font-medium text-foreground">
                    {demoClassAnalytics.badgesEarned}
                  </span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Course Completion Rate</span>
                  <span className="text-sm font-medium text-foreground">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Student Engagement</span>
                  <span className="text-sm font-medium text-foreground">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {currentUser?.name || 'Teacher'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Manage your cybersecurity classes and track student progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Teacher Dashboard
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-background/50 p-1 rounded-lg border border-border mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'analytics' && renderAnalytics()}
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, Users, TrendingUp, 
  Mail, Target, Eye, Clock, ChevronRight,
  Building2, Zap, Brain, FileText, Award,
  DollarSign, CheckCircle, XCircle, AlertCircle,
  Settings, Filter, Search, Bell, BarChart3,
  Cpu, Network, Lock, KeyRound, UserCheck,
  ShieldCheck, Activity, PieChart, LineChart,
  Calendar, Plus, Send, MessageSquare, Download,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/shared/Navbar';
import { CorporateProfile, Employee, SecurityAnalytics } from '@/lib/types';
import { demoCorporate, demoSecurityAnalytics, demoEmployees, demoPhishingCampaigns, demoSecurityThreats } from '@/lib/demo-data';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, Tooltip } from 'recharts';

const COLORS = ['#00FF41', '#FBBF24', '#EF4444', '#536DE2', '#8B5CF6', '#00D4FF'];

export default function CorporateDashboard() {
  const [user, setUser] = useState<CorporateProfile | null>(null);
  const [analytics, setAnalytics] = useState<SecurityAnalytics>(demoSecurityAnalytics);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'corporate') {
        setUser(demoCorporate);
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading security command center...</p>
        </div>
      </div>
    );
  }

  // Calculate risk statistics
  const highRiskEmployees = demoEmployees.filter(emp => emp.riskScore >= 70).length;
  const mediumRiskEmployees = demoEmployees.filter(emp => emp.riskScore >= 40 && emp.riskScore < 70).length;
  const lowRiskEmployees = demoEmployees.filter(emp => emp.riskScore < 40).length;

  const riskDistribution = [
    { name: 'Low Risk', value: lowRiskEmployees, color: '#00FF41' },
    { name: 'Medium Risk', value: mediumRiskEmployees, color: '#FBBF24' },
    { name: 'High Risk', value: highRiskEmployees, color: '#EF4444' },
  ];

  const recentThreats = demoSecurityThreats.slice(0, 3);
  const activePhishingCampaign = demoPhishingCampaigns[0];

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: Shield, color: 'from-blue-500 to-cyan-500' },
    { id: 'employees', label: 'Employee Management', icon: Users, color: 'from-purple-500 to-pink-500' },
    { id: 'threats', label: 'Threat Intelligence', icon: AlertTriangle, color: 'from-red-500 to-orange-500' },
    { id: 'training', label: 'Security Training', icon: Brain, color: 'from-green-500 to-emerald-500' },
  ];

  const securityTools = [
    {
      title: 'Phishing Simulator',
      description: 'Deploy realistic phishing campaigns to test employee awareness',
      icon: Mail,
      color: 'from-red-500 to-pink-600',
      route: '/corporate/tools/phishing',
      stats: '85% click rate'
    },
    {
      title: 'AI Security Training',
      description: 'Generate personalized 5-minute security awareness modules',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      route: '/corporate/tools/training',
      stats: '92% completion'
    },
    {
      title: 'Risk Assessment',
      description: 'Comprehensive employee security risk profiling',
      icon: Target,
      color: 'from-orange-500 to-red-600',
      route: '/corporate/tools/assessment',
      stats: `${highRiskEmployees} high risk`
    },
    {
      title: 'Security Analytics',
      description: 'Real-time monitoring and threat detection dashboard',
      icon: BarChart3,
      color: 'from-green-500 to-teal-600',
      route: '/corporate/analytics',
      stats: `${analytics.threatsDetected} threats`
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/5 to-green-500/10"></div>
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                Security Command Center
                  <span className="ml-2">🛡️</span>
              </h1>
                <p className="text-slate-300 text-lg">
                  {user.company} - Comprehensive cybersecurity protection and awareness training
              </p>
            </div>
              <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400">{user.securityScore}/100</div>
                  <div className="text-slate-400 text-sm">Security Score</div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            </div>
          </div>
        </motion.div>

      {/* Security Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityTools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => router.push(tool.route)}
          >
            <Card className="kokonut-card h-full border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  {tool.description}
                </p>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                  {tool.stats}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Key Security Metrics */}
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
                  <p className="text-sm font-medium text-slate-400">Total Employees</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{demoEmployees.length}</p>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      +12 this month
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Growing workforce
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Users className="h-8 w-8 text-blue-400" />
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
                  <p className="text-sm font-medium text-slate-400">High Risk Employees</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{highRiskEmployees}</p>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                      Immediate attention
                    </Badge>
                  </div>
                  <p className="text-sm text-red-400 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Security vulnerabilities
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
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
                  <p className="text-sm font-medium text-slate-400">Training Completion</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{analytics.trainingCompletion}%</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      +8% this quarter
                    </Badge>
                  </div>
                  <p className="text-sm text-green-400 flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Exceeding targets
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Award className="h-8 w-8 text-green-400" />
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
                  <p className="text-sm font-medium text-slate-400">Active Threats</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-white">{analytics.threatsDetected}</p>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      Last 30 days
                    </Badge>
                </div>
                  <p className="text-sm text-purple-400 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    All contained
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Shield className="h-8 w-8 text-purple-400" />
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
                    <PieChart className="h-5 w-5 text-purple-400" />
                    Employee Risk Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Security risk levels across your organization
                  </CardDescription>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Real-time
                </Badge>
              </div>
                </CardHeader>
                <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
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
                    <LineChart className="h-5 w-5 text-blue-400" />
                    Security Incidents Trend
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Incident detection and response over time
                  </CardDescription>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Trending Down
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.monthlyTrends}>
                  <defs>
                    <linearGradient id="incidentsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
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
                    dataKey="incidents" 
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#incidentsGradient)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#00FF41" 
                    fillOpacity={1} 
                    fill="url(#resolvedGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
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
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                Recent Security Threats
              </CardTitle>
              <CardDescription className="text-slate-400">
                Latest threats detected and contained
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                {recentThreats.map((threat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        threat.severity === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                        threat.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}>
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{threat.type}</div>
                        <div className="text-sm text-slate-400">{threat.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        threat.severity === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-green-500/20 text-green-300 border-green-500/30'
                      }`}>
                        {threat.severity}
                      </Badge>
                      <div className="text-xs text-slate-500">{threat.detectedAt.toLocaleDateString()}</div>
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
                <Mail className="h-5 w-5 text-blue-400" />
                Active Phishing Campaign
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current employee awareness testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{activePhishingCampaign.name}</h4>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Active
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">Active phishing awareness campaign</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{activePhishingCampaign.targets.length}</div>
                      <div className="text-sm text-slate-400">Emails Sent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{Math.round(activePhishingCampaign.targets.length * activePhishingCampaign.clickRate / 100)}</div>
                      <div className="text-sm text-slate-400">Clicked Links</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Click Rate</span>
                      <span className="text-white">{activePhishingCampaign.clickRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={activePhishingCampaign.clickRate} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Eye className="h-3 w-3 mr-1" />
                      View Results
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Download className="h-3 w-3 mr-1" />
                      Export Report
                    </Button>
                  </div>
                          </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
    </div>
  );

  const renderEmployees = () => (
          <div className="space-y-6">
      {/* Header with Search and Filter */}
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Employee Security Management</h2>
          <p className="text-slate-400">Monitor and manage employee security risk profiles</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search employees..."
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

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoEmployees.slice(0, 12).map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      employee.riskScore >= 70 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                      employee.riskScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}>
                      <span className="text-white font-bold">{employee.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{employee.name}</h3>
                      <p className="text-sm text-slate-400">{employee.department}</p>
                    </div>
                  </div>
                  <Badge className={`${
                    employee.riskScore >= 70 ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    employee.riskScore >= 40 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-green-500/20 text-green-300 border-green-500/30'
                  }`}>
                    {employee.riskScore >= 70 ? 'High Risk' : employee.riskScore >= 40 ? 'Medium Risk' : 'Low Risk'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Security Score</span>
                      <span className="text-white">{employee.riskScore}/100</span>
                    </div>
                    <Progress value={100 - employee.riskScore} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Training</span>
                      <div className="text-white font-semibold">{employee.trainingCompleted}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Test</span>
                      <div className="text-white font-semibold">{employee.lastPhishingTest ? employee.lastPhishingTest.toLocaleDateString() : 'Never'}</div>
                    </div>
                        </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Eye className="h-3 w-3 mr-1" />
                      Profile
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Contact
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

  const renderThreats = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Threat Intelligence Dashboard</h2>
        <p className="text-slate-400">Real-time security threat monitoring and analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {demoSecurityThreats.map((threat, index) => (
            <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            >
            <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300">
                <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{threat.type}</CardTitle>
                  <Badge className={`${
                    threat.severity === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-green-500/20 text-green-300 border-green-500/30'
                  }`}>
                    {threat.severity} severity
                            </Badge>
                          </div>
                <CardDescription className="text-slate-400">
                  Detected: {threat.detectedAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">{threat.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Type</span>
                    <div className="text-white font-semibold">{threat.type}</div>
                        </div>
                  <div>
                    <span className="text-slate-400">Status</span>
                    <div className="text-white font-semibold">{threat.resolved ? 'Resolved' : 'Active'}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Eye className="h-3 w-3 mr-1" />
                    Investigate
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Mitigate
                  </Button>
                </div>
                </CardContent>
              </Card>
            </motion.div>
        ))}
                      </div>
                    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
                      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Security Training Programs</h2>
          <p className="text-slate-400">Manage and track employee security awareness training</p>
                      </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Training
        </Button>
                    </div>
                    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
                      </div>
            <h3 className="text-xl font-semibold text-white mb-2">Phishing Simulation</h3>
            <p className="text-slate-400 text-sm mb-4">Test employee awareness with realistic phishing campaigns</p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Launch Campaign
            </Button>
          </CardContent>
        </Card>

        <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
                    </div>
            <h3 className="text-xl font-semibold text-white mb-2">Security Training</h3>
            <p className="text-slate-400 text-sm mb-4">Interactive cybersecurity training modules</p>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              Assign Training
            </Button>
          </CardContent>
        </Card>

        <Card className="kokonut-card border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
                  </div>
            <h3 className="text-xl font-semibold text-white mb-2">Compliance Tracking</h3>
            <p className="text-slate-400 text-sm mb-4">Monitor training completion and compliance status</p>
            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              View Reports
            </Button>
                </CardContent>
              </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      
      <Navbar user={user} notifications={5} />
      
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
            {activeTab === 'employees' && renderEmployees()}
            {activeTab === 'threats' && renderThreats()}
            {activeTab === 'training' && renderTraining()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
} 
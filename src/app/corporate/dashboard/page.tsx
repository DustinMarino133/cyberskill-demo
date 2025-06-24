'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, Users, TrendingUp, 
  Mail, Target, Eye, Clock, ChevronRight,
  Building2, Zap, Brain, FileText, Award,
  DollarSign, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { CorporateProfile, Employee, SecurityAnalytics } from '@/lib/types';
import { demoCorporate, demoSecurityAnalytics, demoEmployees, demoPhishingCampaigns, demoSecurityThreats } from '@/lib/demo-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function CorporateDashboard() {
  const [user, setUser] = useState<CorporateProfile | null>(null);
  const [analytics, setAnalytics] = useState<SecurityAnalytics>(demoSecurityAnalytics);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading security dashboard...</p>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} notifications={5} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Security Command Center
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.company} - Comprehensive security awareness training
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{user.securityScore}/100</div>
              <p className="text-sm text-muted-foreground">Security Score</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold text-foreground">{demoEmployees.length}</p>
                  <p className="text-xs text-cyber-green">+12 this month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-bold text-destructive">{highRiskEmployees}</p>
                  <p className="text-xs text-destructive">Immediate attention needed</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Training Completion</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.trainingCompletion}%</p>
                  <p className="text-xs text-cyber-green">+8% this quarter</p>
                </div>
                <Award className="h-8 w-8 text-cyber-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                  <p className="text-2xl font-bold text-cyber-blue">{analytics.threatsDetected}</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <Shield className="h-8 w-8 text-cyber-blue" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Cywareness Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="cyber-card hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Mail className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Phishing Simulator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Deploy realistic phishing tests to train employees
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => router.push('/corporate/tools/phishing')}
                >
                  Launch Campaign
                </Button>
              </CardContent>
            </Card>

            <Card className="cyber-card hover:border-cyber-green/50 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-cyber-green group-hover:scale-110 transition-transform" />
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Mini-Courses</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  5-minute monthly security training modules
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-cyber-green text-cyber-green hover:bg-cyber-green/10"
                  onClick={() => router.push('/corporate/tools/courses')}
                >
                  Create Course
                </Button>
              </CardContent>
            </Card>

            <Card className="cyber-card hover:border-cyber-blue/50 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-cyber-blue group-hover:scale-110 transition-transform" />
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate security awareness newsletters
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10"
                  onClick={() => router.push('/corporate/tools/newsletter')}
                >
                  Generate Newsletter
                </Button>
              </CardContent>
            </Card>

            <Card className="cyber-card hover:border-cyber-purple/50 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-cyber-purple group-hover:scale-110 transition-transform" />
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Password Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor company-wide password health
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10"
                  onClick={() => router.push('/corporate/tools/passwords')}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Score Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Security Score Trend
                  </CardTitle>
                  <CardDescription>
                    6-month security posture improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#536DE2" 
                          strokeWidth={3}
                          dot={{ fill: '#536DE2', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Phishing Campaign */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cyber-card border-cyber-blue/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-cyber-blue" />
                    Active Phishing Campaign
                  </CardTitle>
                  <CardDescription>
                    Current simulation results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{activePhishingCampaign.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Sent to {activePhishingCampaign.targets.length} employees
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-cyber-blue/20 text-cyber-blue">
                        {activePhishingCampaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Click Rate</span>
                          <span className="font-medium text-destructive">{activePhishingCampaign.clickRate}%</span>
                        </div>
                        <Progress value={activePhishingCampaign.clickRate} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Report Rate</span>
                          <span className="font-medium text-cyber-green">{activePhishingCampaign.reportRate}%</span>
                        </div>
                        <Progress value={activePhishingCampaign.reportRate} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button 
                        className="w-full bg-cyber-blue hover:bg-cyber-blue/90 text-black"
                        onClick={() => router.push('/corporate/tools/phishing')}
                      >
                        View Full Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Employee Risk Heatmap */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        High-Risk Employees
                      </CardTitle>
                      <CardDescription>
                        Employees requiring immediate attention
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push('/corporate/analytics')}
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoEmployees
                      .filter(emp => emp.riskScore >= 70)
                      .slice(0, 3)
                      .map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">{employee.department}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-destructive">{employee.riskScore}</div>
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Distribution</CardTitle>
                  <CardDescription>
                    Employee security risk levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {riskDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Security Threats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    Recent Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentThreats.map((threat) => (
                      <div key={threat.id} className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg">
                        <div className={`mt-1 ${
                          threat.severity === 'critical' ? 'text-destructive' :
                          threat.severity === 'high' ? 'text-orange-500' :
                          threat.severity === 'medium' ? 'text-yellow-500' :
                          'text-cyber-green'
                        }`}>
                          {threat.resolved ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : threat.severity === 'critical' ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">{threat.type}</h4>
                          <p className="text-xs text-muted-foreground">{threat.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant={threat.severity === 'critical' ? 'destructive' : 'secondary'} 
                              className="text-xs"
                            >
                              {threat.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {threat.affectedEmployees.length} affected
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-primary hover:bg-primary/10"
                    onClick={() => router.push('/corporate/analytics')}
                  >
                    View All Threats
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Training Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg">Training Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground text-sm mb-1">Phishing Awareness</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        High click rate detected in recent campaigns
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">High Priority</Badge>
                        <span className="text-xs text-muted-foreground">15 employees</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground text-sm mb-1">Password Security</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Weak passwords detected in security audit
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">Medium Priority</Badge>
                        <span className="text-xs text-muted-foreground">8 employees</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground text-sm mb-1">Social Engineering</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Quarterly training requirement
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">Scheduled</Badge>
                        <span className="text-xs text-muted-foreground">All employees</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 
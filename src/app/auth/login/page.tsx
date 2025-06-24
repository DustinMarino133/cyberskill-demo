'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, User, GraduationCap, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authenticateUser } from '@/lib/demo-data';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'student' | 'teacher' | 'corporate'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const demoCredentials = [
    { role: 'student', email: 'student@demo.com', icon: GraduationCap, label: 'Student', description: 'Learn cybersecurity with AI-powered tools' },
    { role: 'teacher', email: 'teacher@demo.com', icon: User, label: 'Teacher', description: 'Manage classes and track student progress' },
    { role: 'corporate', email: 'corporate@demo.com', icon: Building2, label: 'Corporate', description: 'Enterprise security training and analytics' },
  ];

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = authenticateUser(email, password);
      
      if (user) {
        // Store user session (in real app, this would be handled by proper auth)
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on role
        const redirectPaths = {
          student: '/student/dashboard',
          teacher: '/teacher/dashboard',
          corporate: '/corporate/dashboard',
        };
        
        toast.success(`Welcome back, ${user.name}!`);
        router.push(redirectPaths[user.role]);
      } else {
        toast.error('Invalid credentials. Please use the demo accounts.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemo = (role: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedPlatform(role as 'student' | 'teacher' | 'corporate');
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyber-purple/5" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="cyber-card">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-foreground">
              CyberSkill.AI
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Cybersecurity Education Platform
            </CardDescription>
            
            <Badge variant="secondary" className="mt-2 bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30">
              🚀 DEMO VERSION
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Demo Credentials Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Demo Accounts (Click to auto-fill)
              </Label>
              <div className="grid gap-2">
                {demoCredentials.map((cred) => (
                  <motion.button
                    key={cred.role}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => autofillDemo(cred.role, cred.email)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                  >
                    <cred.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{cred.label}</div>
                      <div className="text-xs text-muted-foreground">{cred.email}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Password: <code className="bg-muted px-1 rounded">password123</code>
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                                      <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      required
                      className="bg-input border-border pr-10"
                    />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="pt-4 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Welcome to CyberSkill.AI Demo!</p>
                <p>Experience how we revolutionize cybersecurity education</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
        >
          <div className="p-4 bg-card/50 rounded-lg border border-border/50">
            <GraduationCap className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">AI-Powered Learning</h3>
            <p className="text-xs text-muted-foreground">Personalized cybersecurity education</p>
          </div>
          <div className="p-4 bg-card/50 rounded-lg border border-border/50">
            <Shield className="h-6 w-6 text-cyber-green mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Gamified Experience</h3>
            <p className="text-xs text-muted-foreground">Learn through badges and challenges</p>
          </div>
          <div className="p-4 bg-card/50 rounded-lg border border-border/50">
            <Building2 className="h-6 w-6 text-cyber-purple mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Enterprise Ready</h3>
            <p className="text-xs text-muted-foreground">Corporate security training</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 
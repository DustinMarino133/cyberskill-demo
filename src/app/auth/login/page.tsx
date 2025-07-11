'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, User, Lock, ArrowRight, Building2, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type UserRole = 'student' | 'teacher' | 'corporate';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const roles = [
    { id: 'student' as UserRole, name: 'Student', icon: GraduationCap, description: 'Access courses and AI tools' },
    { id: 'teacher' as UserRole, name: 'Teacher', icon: Users, description: 'Manage students and curriculum' },
    { id: 'corporate' as UserRole, name: 'Corporate', icon: Building2, description: 'Employee training portal' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store user data
    localStorage.setItem('currentUser', JSON.stringify({
      username,
      role: selectedRole,
      isAuthenticated: true
    }));

    // Navigate based on role
    switch (selectedRole) {
      case 'student':
        router.push('/student/class-selection');
        break;
      case 'teacher':
        router.push('/teacher/dashboard');
        break;
      case 'corporate':
        router.push('/corporate/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-blue-500/20">
          <CardHeader className="text-center">
              <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
                className="flex justify-center mb-4"
              >
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                <Shield className="h-8 w-8 text-blue-400" />
                </div>
              </motion.div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to CyberSkill
              </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to access your cybersecurity education platform
              </CardDescription>
            </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-gray-300">Select your role</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <motion.button
                      key={role.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedRole === role.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400 text-white'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <role.icon className="h-5 w-5 mx-auto mb-1" />
                      <p className="text-xs font-medium">{role.name}</p>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {roles.find(r => r.id === selectedRole)?.description}
                </p>
              </div>

              {/* Username Input */}
                <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                  </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-400"
                    required
                  />
                </div>
                </div>

              {/* Password Input */}
                <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                  </Label>
                  <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                    type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-400"
                      required
                  />
                </div>
                </div>

              {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    {isLoading ? (
                  <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                    )}
                  </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 text-center mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-500 text-center">
                <p>Student: demo / password</p>
                <p>Teacher: teacher / password</p>
                <p>Corporate: corporate / password</p>
              </div>
                </div>
            </CardContent>
          </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          CyberSkill Education Platform © 2024
        </p>
        </motion.div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  GraduationCap, ArrowRight, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ClassInfo {
  id: string;
  grade: number;
  courseName: string;
  classCode: string;
  teacherName: string;
  description: string;
  difficulty: 'beginner' | 'advanced';
}

const DEMO_CLASSES: ClassInfo[] = [
  {
    id: 'class-grade6',
    grade: 6,
    courseName: 'Cybersecurity Basics',
    classCode: 'CS6-2024',
    teacherName: 'Ms. Sarah Johnson',
    description: 'Learn the fundamentals of staying safe online, password security, and digital citizenship.',
    difficulty: 'beginner'
  },
  {
    id: 'class-grade12',
    grade: 12,
    courseName: 'Advanced Cyber Defense',
    classCode: 'ACD12-2024',
    teacherName: 'Mr. David Chen',
    description: 'Advanced concepts in cybersecurity including network security, cryptography, and ethical hacking.',
    difficulty: 'advanced'
  }
];

export default function ClassSelectionPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.role !== 'student') {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const handleClassSelection = (classInfo: ClassInfo) => {
    // Save selected class info
    localStorage.setItem('selectedClass', JSON.stringify(classInfo));
    
    // Set initial coins and XP based on grade level
    if (classInfo.grade === 6) {
      localStorage.setItem('userCoins', '150');
      localStorage.setItem('userXP', '350');
      localStorage.setItem('userLevel', '1');
    } else {
      localStorage.setItem('userCoins', '750');
      localStorage.setItem('userXP', '2100');
      localStorage.setItem('userLevel', '3');
    }
    
    // Redirect to dashboard
    router.push('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
              <Shield className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to CyberSkill</h1>
            <p className="text-xl text-slate-400">Select your class to continue</p>
          </motion.div>

          {/* Class Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {DEMO_CLASSES.map((classInfo, index) => (
              <motion.div
                key={classInfo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card 
                  className={`bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-full ${
                    selectedClass === classInfo.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedClass(classInfo.id)}
                >
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                      <GraduationCap className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-3xl text-white group-hover:text-blue-400 transition-colors mb-2">
                      Grade {classInfo.grade} - {classInfo.teacherName}
                    </CardTitle>
                    <p className="text-slate-400 text-lg">
                      {classInfo.courseName}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="text-center pb-8">
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {classInfo.description}
                    </p>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassSelection(classInfo);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg font-medium"
                      disabled={selectedClass !== classInfo.id}
                    >
                      {selectedClass === classInfo.id ? 'Enter Class' : 'Select Class'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
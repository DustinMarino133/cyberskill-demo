'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Brain, MessageSquare, BookOpen, FileText,
  ChevronRight, Sparkles, Play, Clock, Users,
  Star, Target, Zap, Trophy, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  features: string[];
  difficulty: 'easy' | 'medium' | 'advanced';
  estimatedTime: string;
  popularityScore: number;
  newFeature?: boolean;
}

const AI_TOOLS: AITool[] = [
  {
    id: 'quiz-builder',
    title: 'Smart Quiz Builder',
    description: 'Create intelligent quizzes that adapt to your learning style and track your progress over time.',
    icon: FileText,
    route: '/student/tools/quiz',
    features: [
      'AI-generated questions',
      'Multiple difficulty levels',
      'Real-time feedback',
      'Progress analytics',
      'Custom topics'
    ],
    difficulty: 'easy',
    estimatedTime: '10-15 mins',
    popularityScore: 95,
    newFeature: true
  },
  {
    id: 'flashcards',
    title: 'Interactive Flashcards',
    description: 'Advanced flashcard system with spaced repetition and 3D animations for enhanced memory retention.',
    icon: BookOpen,
    route: '/student/tools/flashcards',
    features: [
      'Spaced repetition algorithm',
      '3D flip animations',
      'Custom card creation',
      'Study statistics',
      'Offline mode'
    ],
    difficulty: 'easy',
    estimatedTime: '15-30 mins',
    popularityScore: 88
  },
  {
    id: 'ai-companion',
    title: 'AI Study Companion',
    description: 'Your personal cybersecurity tutor available 24/7 for questions, explanations, and learning guidance.',
    icon: MessageSquare,
    route: '/student/tools/ai-companion',
    features: [
      '24/7 availability',
      'Personalized responses',
      'Interactive conversations',
      'Topic recommendations',
      'Learning path guidance'
    ],
    difficulty: 'medium',
    estimatedTime: 'Unlimited',
    popularityScore: 92
  },
  {
    id: 'course-builder',
    title: 'Course Builder Pro',
    description: 'Build comprehensive learning paths with AI assistance, tailored to your goals and skill level.',
    icon: Brain,
    route: '/student/tools/course-builder',
    features: [
      'AI-powered curriculum',
      'Skill gap analysis',
      'Resource recommendations',
      'Progress milestones',
      'Certification tracking'
    ],
    difficulty: 'advanced',
    estimatedTime: '30-60 mins',
    popularityScore: 78,
    newFeature: true
  }
];

export default function AIToolsPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.role === 'student') {
          setUser(demoStudent);
        } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-6"
        />
          <p className="text-xl text-gray-400">Loading AI Learning Tools...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  const getPopularityStars = (score: number) => {
    const stars = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
            <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-12 w-12 text-blue-400" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-blue-400/20 rounded-2xl"
              animate={{
                  opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                  duration: 2,
                repeat: Infinity,
                  ease: "easeInOut"
              }}
            />
        </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-6 tracking-tight"
          >
            AI Learning Tools
          </motion.h1>
          
          <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Supercharge your cybersecurity education with intelligent AI-powered tools designed to adapt to your learning style.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center space-x-8 mt-8"
          >
            <div className="flex items-center space-x-2 text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-lg font-medium">10,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Trophy className="h-5 w-5" />
              <span className="text-lg font-medium">95% Success Rate</span>
              </div>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-medium">24/7 Available</span>
            </div>
          </motion.div>
          </motion.div>

          {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {AI_TOOLS.map((tool, index) => (
                <motion.div
                  key={tool.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
                  onHoverStart={() => setHoveredTool(tool.id)}
                  onHoverEnd={() => setHoveredTool(null)}
              className="group"
            >
              <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 backdrop-blur-md border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 h-full overflow-hidden relative">
                {/* New Feature Badge */}
                {tool.newFeature && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ delay: index * 0.15 + 0.5, type: "spring" }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 transform rotate-12">
                      New!
                    </Badge>
                  </motion.div>
                )}

                {/* Animated Background */}
                      <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={hoveredTool === tool.id ? {
                    background: [
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))",
                      "linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))",
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                        <motion.div
                      animate={hoveredTool === tool.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30"
                    >
                      <tool.icon className="h-8 w-8 text-blue-400" />
                        </motion.div>
                        
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="secondary" className={getDifficultyColor(tool.difficulty)}>
                        {tool.difficulty}
                            </Badge>
                      <div className="flex items-center space-x-1">
                        {getPopularityStars(tool.popularityScore)}
                      </div>
                    </div>
                        </div>
                        
                  <CardTitle className="text-2xl text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {tool.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-400 text-lg leading-relaxed">
                          {tool.description}
                  </CardDescription>
                    </CardHeader>

                <CardContent className="relative z-10">
                  <div className="space-y-6">
                      {/* Features */}
                    <div>
                      <p className="text-base font-semibold text-blue-300 mb-4">Key Features:</p>
                      <div className="grid grid-cols-1 gap-3">
                        {tool.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 + idx * 0.1 }}
                            className="flex items-center text-gray-300"
                          >
                            <motion.div
                              animate={hoveredTool === tool.id ? { scale: 1.2 } : { scale: 1 }}
                              className="w-2 h-2 bg-blue-400 rounded-full mr-4 flex-shrink-0"
                            />
                            <span className="text-base">{feature}</span>
                          </motion.div>
                          ))}
                        </div>
                    </div>

                    {/* Time and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{tool.estimatedTime}</span>
                      </div>

                          <Button
                        onClick={() => router.push(tool.route)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 text-base font-medium group-hover:scale-105 transition-transform duration-200"
                      >
                        <span>Start Learning</span>
                        <motion.div
                          animate={hoveredTool === tool.id ? { x: 5 } : { x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </motion.div>
                            </Button>
                    </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Bottom CTA */}
            <motion.div
          initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to accelerate your learning?</h3>
              <p className="text-gray-300 text-lg mb-6">
                Join thousands of students who have enhanced their cybersecurity skills with our AI tools.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => router.push('/student/courses')}
                  variant="outline"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-base px-6 py-2"
                >
                  Browse Courses
                </Button>
                <Button
                  onClick={() => router.push('/student/progress')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-base px-6 py-2"
                >
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
            </motion.div>
      </main>
    </div>
  );
} 
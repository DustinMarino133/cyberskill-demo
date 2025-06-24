'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Brain, Sparkles, BookOpen, Target, Zap, Rocket,
  Bot, Lightbulb, Star, TrendingUp, Clock, Shield,
  PenTool, Search, FileText, MessageSquare, Code,
  ArrowRight, Play, ChevronRight, Wand2, Cpu
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';

export default function AIToolsPage() {
  const router = useRouter();
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const aiTools = [
    {
      id: 'flashcards',
      title: 'AI Flashcards',
      description: 'Generate intelligent flashcards from any cybersecurity topic with AI-powered explanations',
      icon: Brain,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10',
      route: '/student/tools/flashcards',
      features: ['Smart Generation', 'Spaced Repetition', 'Progress Tracking'],
      status: 'popular',
      emoji: '🧠'
    },
    {
      id: 'quiz',
      title: 'AI Quiz Builder',
      description: 'Create custom quizzes with AI-generated questions tailored to your learning level',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10',
      route: '/student/tools/quiz',
      features: ['Custom Difficulty', 'Instant Feedback', 'Performance Analytics'],
      status: 'featured',
      emoji: '🎯'
    },
    {
      id: 'course-builder',
      title: 'Course Builder',
      description: 'Build personalized learning paths with AI-curated cybersecurity content',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-500/10 to-violet-600/10',
      route: '/student/tools/course-builder',
      features: ['Personalized Paths', 'Progress Tracking', 'Skill Assessment'],
      status: 'new',
      emoji: '📚'
    },
    {
      id: 'study-assistant',
      title: 'AI Study Assistant',
      description: 'Get instant help with cybersecurity concepts through intelligent conversation',
      icon: Bot,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-500/10 to-red-600/10',
      route: '/student/tools/study-assistant',
      features: ['24/7 Availability', 'Context Aware', 'Multi-language'],
      status: 'coming-soon',
      emoji: '🤖'
    },
    {
      id: 'concept-explainer',
      title: 'Concept Explainer',
      description: 'Break down complex cybersecurity concepts into easy-to-understand explanations',
      icon: Lightbulb,
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-gradient-to-br from-amber-500/10 to-yellow-600/10',
      route: '/student/tools/concept-explainer',
      features: ['Visual Learning', 'Step-by-step', 'Real Examples'],
      status: 'coming-soon',
      emoji: '💡'
    },
    {
      id: 'code-analyzer',
      title: 'Security Code Analyzer',
      description: 'Analyze code for security vulnerabilities with AI-powered detection',
      icon: Code,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10',
      route: '/student/tools/code-analyzer',
      features: ['Vulnerability Detection', 'Best Practices', 'Fix Suggestions'],
      status: 'coming-soon',
      emoji: '💻'
    },
    {
      id: 'threat-simulator',
      title: 'Threat Simulator',
      description: 'Practice identifying and responding to cybersecurity threats in safe environment',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-red-500/10 to-pink-600/10',
      route: '/student/tools/threat-simulator',
      features: ['Safe Environment', 'Real Scenarios', 'Performance Metrics'],
      status: 'coming-soon',
      emoji: '🛡️'
    },
    {
      id: 'study-planner',
      title: 'AI Study Planner',
      description: 'Create optimized study schedules based on your learning patterns and goals',
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-500/10 to-emerald-600/10',
      route: '/student/tools/study-planner',
      features: ['Smart Scheduling', 'Goal Tracking', 'Adaptive Planning'],
      status: 'coming-soon',
      emoji: '⏰'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'featured':
        return <Badge className="bg-gradient-to-r from-primary to-cyber-blue text-white">⭐ Featured</Badge>;
      case 'popular':
        return <Badge className="bg-gradient-to-r from-cyber-purple to-primary text-white">🔥 Popular</Badge>;
      case 'new':
        return <Badge className="bg-gradient-to-r from-cyber-green to-emerald-600 text-white">✨ New</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">🚀 Soon</Badge>;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyber-purple/5 to-cyber-blue/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(83,109,226,0.1),transparent_50%)]" />
        <div className="cyber-grid-lg opacity-20" />
        
        {/* Floating AI Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 15, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
            className={`absolute w-1 h-1 rounded-full blur-sm ${
              i % 4 === 0 ? 'bg-primary' : 
              i % 4 === 1 ? 'bg-cyber-blue' : 
              i % 4 === 2 ? 'bg-cyber-purple' : 'bg-cyber-green'
            }`}
            style={{
              top: `${15 + (i * 12) % 70}%`,
              left: `${8 + (i * 15) % 84}%`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyber-blue rounded-full blur-xl opacity-50 animate-pulse-slow" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary via-cyber-blue to-cyber-purple rounded-full flex items-center justify-center shadow-cyber-strong">
                <Cpu className="h-10 w-10 text-white animate-pulse" />
              </div>
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">AI-Powered</span>{" "}
            <span className="glow-text">Learning Tools</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Supercharge your cybersecurity learning with cutting-edge AI tools designed to 
            accelerate your understanding and boost your skills.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400">
            {[
              { icon: Sparkles, text: "AI-Powered" },
              { icon: Zap, text: "Instant Results" },
              { icon: TrendingUp, text: "Adaptive Learning" }
            ].map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {aiTools.map((tool, index) => {
            const Icon = tool.icon;
            const isAvailable = !tool.status?.includes('coming-soon');
            
            return (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredTool(tool.id)}
                onHoverEnd={() => setHoveredTool(null)}
                className="group h-full"
              >
                <div className={`kokonut-card h-full ${tool.bgColor} 
                              ${hoveredTool === tool.id ? 'cyber-glow-strong' : 'hover:cyber-glow'} 
                              transition-all duration-300 relative overflow-hidden
                              ${isAvailable ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
                     onClick={() => isAvailable && router.push(tool.route)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    {getStatusBadge(tool.status)}
                  </div>

                  {/* Tool Header */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <motion.div
                        animate={{
                          rotate: hoveredTool === tool.id ? 360 : 0,
                          scale: hoveredTool === tool.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} 
                                   flex items-center justify-center shadow-lg mx-auto mb-4
                                   ${hoveredTool === tool.id ? 'shadow-cyber' : ''}`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      <div className="text-3xl absolute -bottom-2 -right-2 animate-bounce-slow">
                        {tool.emoji}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                        {tool.title}
                      </h3>
                      
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors">
                          <div className={`w-1.5 h-1.5 rounded-full mr-3 bg-gradient-to-r ${tool.color}`} />
                          <span className="text-xs font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    {isAvailable ? (
                      <Button 
                        variant="ghost" 
                        className="w-full group-hover:bg-white/10 transition-all duration-300"
                      >
                        <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        <span>Launch Tool</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        disabled
                        className="w-full opacity-50"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Coming Soon</span>
                      </Button>
                    )}
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    animate={{
                      opacity: hoveredTool === tool.id ? 0.3 : 0,
                      scale: hoveredTool === tool.id ? 1 : 0.8
                    }}
                    className={`absolute inset-0 bg-gradient-to-r ${tool.color} rounded-2xl blur-xl -z-10`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <Wand2 className="h-12 w-12 text-primary animate-pulse" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-white">Ready to Level Up</span><br />
                <span className="gradient-text">Your Cybersecurity Skills?</span>
              </h2>
              
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Our AI tools adapt to your learning style and pace, providing personalized 
                experiences that accelerate your cybersecurity mastery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="kokonut-button kokonut-button-primary px-8 py-3 group"
                  onClick={() => router.push('/student/tools/flashcards')}
                >
                  <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start with Flashcards
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="glassmorphism border-white/20 text-slate-200 hover:bg-white/10 px-8 py-3"
                  onClick={() => router.push('/student/dashboard')}
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View Progress
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
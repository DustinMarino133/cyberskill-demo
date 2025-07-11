'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Send, Bot, User, ArrowLeft, 
  Brain, Shield, Lightbulb, Sparkles,
  BookOpen, Target, Award, Rocket, Star,
  Volume2, VolumeX, Settings, RefreshCw,
  ThumbsUp, ThumbsDown, Smile, Heart,
  Clock, AlertCircle, FileText, CheckCircle,
  Calendar, BarChart3, Zap, Trophy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  helpful?: boolean;
  type?: 'normal' | 'quiz' | 'assignment' | 'suggestion';
}

interface AssignmentReminder {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'submitted';
  priority: 'high' | 'medium' | 'low';
}

interface QuizSuggestion {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  basedOn: string;
}

interface StudentContext {
  assignments: AssignmentReminder[];
  recentTopics: string[];
  weakAreas: string[];
  studyStreak: number;
  nextClass: string;
  upcomingQuizzes: string[];
}

export default function AICompanionPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [conversationCount, setConversationCount] = useState(0);
  const [studentContext] = useState<StudentContext>({
    assignments: [
      {
        id: '1',
        title: 'Network Security Assessment',
        course: 'Cybersecurity Fundamentals',
        dueDate: 'Tomorrow',
        status: 'pending',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Firewall Configuration Lab',
        course: 'Network Security',
        dueDate: 'Feb 5',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Social Engineering Research',
        course: 'Human Factors in Security',
        dueDate: 'Feb 12',
        status: 'pending',
        priority: 'low'
      }
    ],
    recentTopics: ['Network Security', 'Encryption', 'Phishing Defense', 'Password Management'],
    weakAreas: ['Cryptography', 'Network Protocols', 'Incident Response'],
    studyStreak: 23,
    nextClass: 'Advanced Cybersecurity - Tomorrow 2:00 PM',
    upcomingQuizzes: ['Encryption Basics Quiz - Feb 3', 'Network Security Test - Feb 8']
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        initializeChat();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Hi Alex! 👋 I'm your AI study companion. I've been keeping track of your progress and I'm here to help you succeed in cybersecurity.

Here's what I can help you with today:
📚 Study assistance and explanations
🧠 Generate custom quizzes on any topic
📝 Review your assignments and deadlines
💡 Provide personalized study recommendations
🎯 Track your learning goals and progress

I notice you have a Network Security Assessment due tomorrow. Would you like me to help you prepare for it or generate a practice quiz?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'normal'
    };
    setMessages([welcomeMessage]);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let content = '';
    let type: 'normal' | 'quiz' | 'assignment' | 'suggestion' = 'normal';
    
    // Assignment-related queries
    if (lowerMessage.includes('assignment') || lowerMessage.includes('due') || lowerMessage.includes('deadline')) {
      const highPriorityAssignments = studentContext.assignments.filter(a => a.priority === 'high');
      content = `📝 **Your Current Assignments:**

${studentContext.assignments.map(assignment => `
**${assignment.title}** (${assignment.course})
• Due: ${assignment.dueDate}
• Status: ${assignment.status}
• Priority: ${assignment.priority.toUpperCase()}
${assignment.priority === 'high' ? '⚠️ High priority - due soon!' : ''}
`).join('\n')}

${highPriorityAssignments.length > 0 ? `\n🚨 **Urgent:** You have ${highPriorityAssignments.length} high-priority assignment(s) due soon. Need help with any of these?` : ''}

Would you like me to generate a study plan or practice quiz for any of these topics?`;
      type = 'assignment';
    }
    
    // Quiz generation requests
    else if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('practice')) {
      const suggestedTopics = studentContext.recentTopics.concat(studentContext.weakAreas);
      content = `🧠 **Quiz Generator Ready!**

I can create personalized practice quizzes for you on any cybersecurity topic. Based on your recent activity, here are some recommendations:

**Suggested Topics:**
${suggestedTopics.slice(0, 4).map(topic => `• ${topic}`).join('\n')}

**What I can generate:**
• Multiple choice questions
• True/false questions  
• Scenario-based questions
• Difficulty levels: Easy, Medium, Hard
• Custom length: 5-20 questions

Just tell me what topic you'd like to practice and I'll create a quiz for you! For example:
- "Create a 10-question medium quiz on network security"
- "Generate an easy cryptography quiz"
- "Make a hard quiz about incident response"`;
      type = 'quiz';
    }
    
    // Study recommendations based on weak areas
    else if (lowerMessage.includes('study') || lowerMessage.includes('help') || lowerMessage.includes('learn')) {
      content = `📚 **Personalized Study Recommendations**

Based on your progress, I've identified some areas where you could benefit from additional practice:

**Areas to Focus On:**
${studentContext.weakAreas.map(area => `• **${area}** - I can create targeted exercises for this`).join('\n')}

**Your Recent Strengths:**
${studentContext.recentTopics.slice(0, 3).map(topic => `• ${topic} ✅`).join('\n')}

**Study Plan Suggestions:**
1. **Review ${studentContext.weakAreas[0]}** - 30 minutes daily
2. **Practice quizzes** on areas you're struggling with
3. **Flashcard review** for terminology
4. **Join study groups** for collaborative learning

Your current streak is ${studentContext.studyStreak} days - keep it up! 🔥

What specific topic would you like to dive deeper into?`;
      type = 'suggestion';
    }
    
    // Progress and stats
    else if (lowerMessage.includes('progress') || lowerMessage.includes('stats') || lowerMessage.includes('performance')) {
      content = `📊 **Your Learning Progress**

**Current Streak:** ${studentContext.studyStreak} days 🔥
**Active Assignments:** ${studentContext.assignments.length}
**Upcoming Classes:** ${studentContext.nextClass}

**Recent Activity:**
${studentContext.recentTopics.map(topic => `• Studied ${topic}`).join('\n')}

**Upcoming Assessments:**
${studentContext.upcomingQuizzes.map(quiz => `• ${quiz}`).join('\n')}

**Recommendation:** You're doing great with consistency! Consider focusing on ${studentContext.weakAreas[0]} to round out your knowledge.

Would you like me to create a practice quiz on any of these topics?`;
      type = 'suggestion';
    }
    
    // Specific cybersecurity topics
    else if (lowerMessage.includes('password') || lowerMessage.includes('encryption') || lowerMessage.includes('cryptography')) {
      content = `🔐 **Cryptography & Password Security**

Great choice! This is a fundamental cybersecurity topic. Here's what I can help you with:

**Key Concepts to Master:**
• Symmetric vs Asymmetric encryption
• Hashing algorithms (SHA, MD5)
• Digital signatures and certificates
• Password complexity and storage
• Salt and key derivation functions

**Practice Opportunities:**
• I can generate quizzes on cryptographic algorithms
• Create scenarios about real-world encryption use
• Test your knowledge of password security best practices

**Assignment Connection:** I see you have areas to improve in cryptography - this aligns perfectly with your learning goals!

Would you like me to create a practice quiz or explain any specific cryptographic concept?`;
      type = 'normal';
    }
    
    else if (lowerMessage.includes('network') || lowerMessage.includes('firewall') || lowerMessage.includes('security')) {
      content = `🌐 **Network Security Expertise**

Perfect timing! I notice you have a Network Security Assessment due tomorrow. Let me help you prepare:

**Key Network Security Topics:**
• Firewall configuration and rules
• Intrusion Detection/Prevention Systems (IDS/IPS)
• Network segmentation and VLANs
• VPN technologies and protocols
• Network monitoring and analysis

**Assessment Preparation:**
• I can generate practice questions similar to your upcoming assessment
• Create scenarios about network attack mitigation
• Review firewall rule configurations
• Test your knowledge of security protocols

**Quick Tip:** Based on your recent lab work, make sure you understand the difference between stateful and stateless firewalls!

Ready for a practice quiz to test your knowledge before tomorrow's assessment?`;
      type = 'assignment';
    }
    
    // Default helpful response
    else {
      content = `🤖 **How I Can Help You Today**

I'm your personalized AI study companion with access to your learning data. Here's what makes me different:

**I Know Your Context:**
• Your current assignments and deadlines
• Topics you've recently studied
• Areas where you need more practice
• Your study patterns and streaks

**What I Can Do:**
• Generate custom quizzes tailored to your needs
• Explain complex cybersecurity concepts
• Help you prepare for specific assignments
• Create study plans based on your weak areas
• Track your progress and celebrate achievements

**Try asking me:**
"Help me prepare for my network security assessment"
"Generate a quiz on the topics I'm struggling with"
"What should I focus on for my upcoming assignments?"
"Explain cryptography concepts I need to understand"

What would you like to work on today?`;
      type = 'suggestion';
    }

    return {
      id: (Date.now()).toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      type
    };
  };

  const sendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    setConversationCount(prev => prev + 1);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const markMessageHelpful = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ));
  };

  const startNewConversation = () => {
    setMessages([]);
    initializeChat();
    setConversationCount(0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your AI companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => router.push('/student/tools')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">AI Study Companion</h1>
              <p className="text-gray-600">Your personalized cybersecurity learning assistant</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                onClick={startNewConversation}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {conversationCount > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 text-sm">{messages.length - 1} messages exchanged</span>
                    <span className="text-gray-700 text-sm">Streak: {studentContext.studyStreak} days</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">Active Learning Session</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-gray-200 h-full flex flex-col">
              <CardHeader className="pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-800 text-lg">CyberMentor AI</CardTitle>
                    <CardDescription className="text-gray-600">
                      {isTyping ? 'Analyzing your context...' : 'Ready to help with your cybersecurity journey!'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                        <div className={`p-4 rounded-2xl ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="flex items-start gap-3">
                            {msg.sender === 'ai' && (
                              <Bot className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                            )}
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                          </div>
                        </div>
                        
                        {msg.sender === 'ai' && msg.id !== 'welcome' && (
                          <div className="flex items-center gap-2 mt-2 px-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markMessageHelpful(msg.id, true)}
                              className={`h-6 text-xs ${msg.helpful === true ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markMessageHelpful(msg.id, false)}
                              className={`h-6 text-xs ${msg.helpful === false ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <span className="text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl max-w-[80%]">
                        <div className="flex items-center gap-3">
                          <Bot className="h-4 w-4 text-blue-600" />
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-600 rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-sm">Analyzing your context...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Ask me about your assignments, request a quiz, or get study help..."
                      className="bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Context Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Upcoming Assignments */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Due Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentContext.assignments.slice(0, 2).map((assignment) => (
                  <div key={assignment.id} className={`p-3 rounded-lg border-l-4 ${
                    assignment.priority === 'high' ? 'border-red-500 bg-red-50' :
                    assignment.priority === 'medium' ? 'border-orange-500 bg-orange-50' :
                    'border-gray-300 bg-gray-50'
                  }`}>
                    <h4 className="font-medium text-gray-800 text-sm">{assignment.title}</h4>
                    <p className="text-xs text-gray-600">{assignment.course}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Stats */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Study Streak</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-800">{studentContext.studyStreak}</span>
                    <span className="text-xs text-gray-500">days</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Assignments</span>
                  <span className="font-semibold text-gray-800">{studentContext.assignments.length}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Next Class:</p>
                  <p className="text-sm text-gray-700">{studentContext.nextClass}</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-800 text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🧠</span>
                    <span>Custom Quiz Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📝</span>
                    <span>Assignment Help</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span>Progress Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💡</span>
                    <span>Study Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>Personalized Learning</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-left justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMessage("Help me prepare for my network security assessment")}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Prep for Assessment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-left justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMessage("Generate a quiz on cryptography")}
                >
                  <Brain className="h-3 w-3 mr-2" />
                  Generate Quiz
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-left justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMessage("Show my study recommendations")}
                >
                  <Target className="h-3 w-3 mr-2" />
                  Study Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 
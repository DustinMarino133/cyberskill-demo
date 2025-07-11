'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, Brain, MessageSquare, Send, Plus, Eye, 
  Edit, Trash2, Filter, Search, Star, Clock, Target, CheckCircle, 
  XCircle, FileText, Upload, Download, Settings, ChevronDown,
  AlertTriangle, Award, TrendingUp, Calendar, Paperclip, Play,
  FlaskConical, GraduationCap, Shield, Monitor, Pin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/shared/Navbar';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  assignments: {
    submitted: number;
    missing: number;
    total: number;
  };
  averageScore: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'struggling';
}

interface Assignment {
  id: string;
  title: string;
  type: 'quiz' | 'lab' | 'project';
  grade: string;
  dueDate: string;
  totalPoints: number;
  submissions: number;
  totalStudents: number;
  averageScore: number;
  status: 'draft' | 'published' | 'closed';
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  totalPoints: number;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'preview' | 'published';
}

export default function TeacherClassroom() {
  const [user, setUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<'classroom' | 'ai-assistant' | 'quiz-builder' | 'students' | 'labs'>('classroom');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showQuizPreview, setShowQuizPreview] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{id: string, content: string, sender: 'teacher' | 'ai', timestamp: Date}>>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Quiz creation states
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    timeLimit: 30,
    questions: [] as QuizQuestion[]
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'multiple-choice' as 'multiple-choice' | 'true-false' | 'essay',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  
  const router = useRouter();

  // Mock data for students with detailed tracking
  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Chen',
      email: 'alex.chen@school.edu',
      grade: 85,
      assignments: { submitted: 8, missing: 2, total: 10 },
      averageScore: 85,
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: '2', 
      name: 'Sarah Johnson',
      email: 'sarah.j@school.edu',
      grade: 92,
      assignments: { submitted: 10, missing: 0, total: 10 },
      averageScore: 92,
      lastActive: '30 minutes ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'mike.r@school.edu', 
      grade: 67,
      assignments: { submitted: 6, missing: 4, total: 10 },
      averageScore: 67,
      lastActive: '1 day ago',
      status: 'struggling'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@school.edu',
      grade: 88,
      assignments: { submitted: 9, missing: 1, total: 10 },
      averageScore: 88,
      lastActive: '1 hour ago',
      status: 'active'
    }
  ];

  // Mock assignments with detailed tracking
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Network Security Quiz',
      type: 'quiz',
      grade: 'Grade 6',
      dueDate: 'Tomorrow',
      totalPoints: 100,
      submissions: 18,
      totalStudents: 24,
      averageScore: 84,
      status: 'published'
    },
    {
      id: '2',
      title: 'Firewall Configuration Lab',
      type: 'lab', 
      grade: 'Grade 6',
      dueDate: 'Feb 5',
      totalPoints: 75,
      submissions: 12,
      totalStudents: 24,
      averageScore: 78,
      status: 'published'
    },
    {
      id: '3',
      title: 'Cryptography Project',
      type: 'project',
      grade: 'Grade 6',
      dueDate: 'Feb 15',
      totalPoints: 150,
      submissions: 0,
      totalStudents: 24,
      averageScore: 0,
      status: 'draft'
    }
  ];

  // Sample quizzes with full data
  const [quizzes, setQuizzes] = useState([
    {
      id: '1',
      title: 'Network Security Fundamentals',
      description: 'Basic concepts of network security',
      questions: [
        {
          id: '1',
          question: 'What does a firewall do?',
          type: 'multiple-choice' as const,
          options: ['Prevents viruses', 'Controls network traffic', 'Stores passwords', 'Encrypts files'],
          correctAnswer: 1,
          explanation: 'A firewall controls incoming and outgoing network traffic based on predetermined security rules.'
        },
        {
          id: '2', 
          question: 'SSL/TLS is used for secure communication.',
          type: 'true-false' as const,
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'SSL/TLS protocols provide secure communication over the internet by encrypting data.'
        }
      ],
      timeLimit: 30,
      totalPoints: 100,
      grade: 'Grade 6',
      difficulty: 'medium' as const,
      status: 'published' as const
    },
    {
      id: '2', 
      title: 'Cryptography Basics',
      description: 'Introduction to encryption methods',
      questions: [
        {
          id: '1',
          question: 'What is the purpose of encryption?',
          type: 'multiple-choice' as const,
          options: ['Speed up internet', 'Protect data', 'Save storage', 'Improve graphics'],
          correctAnswer: 1,
          explanation: 'Encryption protects data by converting it into a code that unauthorized users cannot easily read.'
        }
      ],
      timeLimit: 25,
      totalPoints: 50,
      grade: 'Grade 6', 
      difficulty: 'easy' as const,
      status: 'draft' as const
    }
  ]);

  // Mock labs library
  const labsLibrary = [
    {
      id: 'lab-1',
      title: 'Network Penetration Testing',
      description: 'Hands-on lab for ethical hacking techniques',
      grade: 'Grade 6',
      difficulty: 'Hard',
      duration: '90 minutes',
      topics: ['Nmap', 'Metasploit', 'Vulnerability Assessment']
    },
    {
      id: 'lab-2',
      title: 'Digital Forensics Investigation', 
      description: 'Investigate cybercrime scenarios using forensic tools',
      grade: 'Grade 6',
      difficulty: 'Medium',
      duration: '75 minutes',
      topics: ['Autopsy', 'Volatility', 'Registry Analysis']
    },
    {
      id: 'lab-3',
      title: 'Secure Network Configuration',
      description: 'Configure enterprise-level network security',
      grade: 'Grade 6', 
      difficulty: 'Medium',
      duration: '60 minutes',
      topics: ['pfSense', 'OpenVPN', 'Snort IDS']
    }
  ];

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'teacher') {
        setUser(userData);
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleAiMessage = async () => {
    if (!aiMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: aiMessage,
      sender: 'teacher' as const,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, newMessage]);
    setAiMessage('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: generateAiResponse(aiMessage),
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 2000);
  };

  const generateAiResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('question')) {
      return `I can help you create a quiz! Here are some sample questions for cybersecurity:

**Multiple Choice:**
1. What is the primary purpose of a firewall?
   a) Speed up internet connection
   b) Filter network traffic based on security rules ✓
   c) Store user passwords
   d) Encrypt data

**True/False:**
2. SSL and TLS are the same protocol. (False)

**Essay:**
3. Explain the difference between symmetric and asymmetric encryption.

Would you like me to generate more questions or help you create a complete quiz?`;
    }
    
    if (lowerMessage.includes('student') || lowerMessage.includes('grade')) {
      return `Based on your class analytics, here are some insights:

📊 **Class Overview:**
- Average grade: 83%
- Students struggling: 1 (Michael Rodriguez - 67%)
- Top performer: Sarah Johnson (92%)
- Missing assignments: 7 total across all students

🎯 **Recommendations:**
- Consider offering extra help to Michael
- Create a peer tutoring system
- Send reminders for missing assignments

Would you like me to create personalized learning plans for struggling students?`;
    }
    
    if (lowerMessage.includes('assignment') || lowerMessage.includes('lab')) {
      return `I can help you create engaging assignments! Here are some ideas:

🔬 **Lab Suggestions:**
- Phishing Email Analysis Lab
- Password Cracking Simulation
- Network Traffic Analysis

📝 **Quiz Topics:**
- Social Engineering Defense
- Incident Response Procedures
- Cloud Security Fundamentals

📋 **Project Ideas:**
- Security Risk Assessment Report
- Cybersecurity Awareness Campaign
- Vulnerability Assessment Case Study

Which type of assignment would you like me to help you develop?`;
    }
    
    return `I'm your AI teaching assistant! I can help you with:

📚 **Curriculum Development**
- Generate quiz questions and answers
- Create lab scenarios and instructions
- Design project rubrics

👥 **Student Management** 
- Analyze class performance
- Identify struggling students
- Suggest intervention strategies

📊 **Assessment Tools**
- Create diverse question types
- Generate explanations and feedback
- Design difficulty-appropriate content

What would you like help with today?`;
  };

  const handleCreateQuiz = () => {
    const quiz = {
      id: Date.now().toString(),
      title: newQuiz.title,
      description: newQuiz.description,
      questions: newQuiz.questions,
      timeLimit: newQuiz.timeLimit,
      totalPoints: newQuiz.questions.length * 10,
      grade: 'Grade 6',
      difficulty: newQuiz.difficulty,
      status: 'draft' as const
    };
    
    setQuizzes(prev => [...prev, quiz]);
    setShowQuizModal(false);
    setNewQuiz({ title: '', description: '', difficulty: 'medium', timeLimit: 30, questions: [] });
  };

  const handleAddQuestion = () => {
    const question: QuizQuestion = {
      id: Date.now().toString(),
      question: currentQuestion.question,
      type: currentQuestion.type,
      options: currentQuestion.type === 'true-false' ? ['True', 'False'] : currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation
    };
    
    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, question]
    }));
    
    setCurrentQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const handlePreviewQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setShowQuizPreview(true);
  };

  const handleEditQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setNewQuiz({
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions
    });
    setShowQuizEditor(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const generateQuizWithAI = async (topic: string, difficulty: string) => {
    setIsAiTyping(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedQuestions = [
      {
        id: Date.now().toString(),
        question: `What is the most important aspect of ${topic}?`,
        type: 'multiple-choice' as const,
        options: ['Security', 'Speed', 'Cost', 'Ease of use'],
        correctAnswer: 0,
        explanation: `Security is the primary concern when dealing with ${topic}.`
      },
      {
        id: (Date.now() + 1).toString(),
        question: `${topic} is essential for cybersecurity.`,
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: `${topic} plays a crucial role in maintaining cybersecurity.`
      }
    ];
    
    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, ...generatedQuestions]
    }));
    
    setIsAiTyping(false);
  };

  const renderClassroom = () => (
    <div className="space-y-6">
      {/* Classroom Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Post Announcement</h3>
                <p className="text-gray-300 text-sm">Share updates with students</p>
              </div>
              <Button 
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Create Assignment</h3>
                <p className="text-gray-300 text-sm">Design new challenges</p>
              </div>
              <Button 
                onClick={() => router.push('/teacher/quiz-builder')}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Assign Lab</h3>
                <p className="text-gray-300 text-sm">From lab library</p>
              </div>
              <Button 
                onClick={() => setCurrentTab('labs')}
                className="bg-green-500 hover:bg-green-600"
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Recent Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    assignment.type === 'quiz' ? 'bg-blue-500/20' : 
                    assignment.type === 'lab' ? 'bg-green-500/20' : 'bg-purple-500/20'
                  }`}>
                    {assignment.type === 'quiz' ? <FileText className="h-5 w-5 text-blue-400" /> :
                     assignment.type === 'lab' ? <FlaskConical className="h-5 w-5 text-green-400" /> :
                     <Target className="h-5 w-5 text-purple-400" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{assignment.title}</h3>
                    <p className="text-gray-400 text-sm">Due: {assignment.dueDate} • {assignment.submissions}/{assignment.totalStudents} submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${assignment.status === 'published' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {assignment.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAiAssistant = () => (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Teaching Assistant
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              File Upload Ready
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Upload curriculum files, generate quizzes, and get teaching assistance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-medium text-white mb-2">AI Teaching Assistant</h3>
                <p>Upload files, ask questions, or request quiz generation to get started!</p>
              </div>
            )}
            
            {aiMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'teacher' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700/50 text-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700/50 text-gray-200 p-4 rounded-2xl max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-700/50 p-4 space-y-4">
            {/* File Upload */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <Upload className="h-4 w-4 mr-2" />
                Upload Curriculum
              </Button>
              <span className="text-xs text-gray-500">PDF, DOCX, TXT supported</span>
            </div>
            
            {/* Message Input */}
            <div className="flex gap-3">
              <Input
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAiMessage()}
                placeholder="Ask for quiz generation, curriculum help, or teaching advice..."
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                disabled={isAiTyping}
              />
              <Button
                onClick={handleAiMessage}
                disabled={!aiMessage.trim() || isAiTyping}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuizBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Quiz Builder</h2>
          <p className="text-gray-400">Create and manage quizzes with AI assistance</p>
        </div>
        <Button 
          onClick={() => setShowQuizModal(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Quizzes */}
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={`${
                  quiz.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                  quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {quiz.difficulty}
                </Badge>
                <Badge className={`${
                  quiz.status === 'published' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {quiz.status}
                </Badge>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{quiz.description}</p>
              
              <div className="space-y-2 mb-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.timeLimit} minutes</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-gray-600 text-gray-300"
                  onClick={() => handlePreviewQuiz(quiz)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-600 text-gray-300"
                  onClick={() => handleEditQuiz(quiz)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-600 text-red-400 hover:bg-red-500/20"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Quiz Modal */}
      <AnimatePresence>
        {showQuizModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create New Quiz</h3>
                <Button
                  onClick={() => setShowQuizModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Quiz Title</Label>
                  <Input 
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-1"
                    placeholder="e.g., Network Security Basics"
                  />
                </div>
                <div>
                  <Label className="text-white">Quiz Description</Label>
                  <textarea 
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20 mt-1 p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                    placeholder="Brief description of the quiz content"
                  />
                </div>
                <div>
                  <Label className="text-white">Difficulty</Label>
                  <select 
                    value={newQuiz.difficulty}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white">Time Limit (minutes)</Label>
                  <Input 
                    type="number"
                    value={newQuiz.timeLimit}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value, 10) || 0 }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-1"
                    placeholder="e.g., 30"
                  />
                </div>
                <Button 
                  onClick={handleCreateQuiz}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!newQuiz.title || !newQuiz.timeLimit || newQuiz.questions.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Questions
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Preview Modal */}
      <AnimatePresence>
        {showQuizPreview && selectedQuiz && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Quiz Preview</h3>
                <Button
                  onClick={() => setShowQuizPreview(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">{selectedQuiz.title}</h2>
                <p className="text-gray-400 text-sm">{selectedQuiz.description}</p>
                <Badge className={`${
                  selectedQuiz.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                  selectedQuiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {selectedQuiz.difficulty}
                </Badge>
                <p className="text-gray-400 text-sm">Time Limit: {selectedQuiz.timeLimit} minutes</p>
                <p className="text-gray-400 text-sm">Total Points: {selectedQuiz.totalPoints}</p>

                <h3 className="text-lg font-bold text-white mt-6">Questions</h3>
                <div className="space-y-4">
                  {selectedQuiz.questions.map((q) => (
                    <div key={q.id} className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">{q.question}</h4>
                      <p className="text-gray-400 text-sm mb-2">Type: {q.type}</p>
                      {q.type === 'multiple-choice' && (
                        <ul className="list-disc list-inside text-gray-300 text-sm mb-2">
                          {q.options?.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      {q.type === 'true-false' && (
                        <p className="text-gray-300 text-sm">Correct Answer: {q.options?.[q.correctAnswer]}</p>
                      )}
                      {q.explanation && (
                        <p className="text-gray-400 text-sm mt-2">Explanation: {q.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Editor Modal */}
      <AnimatePresence>
        {showQuizEditor && selectedQuiz && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Quiz</h3>
                <Button
                  onClick={() => setShowQuizEditor(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Quiz Title</Label>
                  <Input 
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-1"
                    placeholder="e.g., Network Security Basics"
                  />
                </div>
                <div>
                  <Label className="text-white">Quiz Description</Label>
                  <textarea 
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20 mt-1 p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                    placeholder="Brief description of the quiz content"
                  />
                </div>
                <div>
                  <Label className="text-white">Difficulty</Label>
                  <select 
                    value={newQuiz.difficulty}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white">Time Limit (minutes)</Label>
                  <Input 
                    type="number"
                    value={newQuiz.timeLimit}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value, 10) || 0 }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-1"
                    placeholder="e.g., 30"
                  />
                </div>
                <Button 
                  onClick={() => {
                    const updatedQuiz = { ...selectedQuiz, ...newQuiz };
                    setQuizzes(prev => prev.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
                    setShowQuizEditor(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!newQuiz.title || !newQuiz.timeLimit || newQuiz.questions.length === 0}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Student Management</h2>
          <p className="text-gray-400">Track progress, grades, and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Overview */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{students.length}</div>
            <div className="text-white font-medium">Total Students</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
            </div>
            <div className="text-white font-medium">Class Average</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {students.filter(s => s.status === 'struggling').length}
            </div>
            <div className="text-white font-medium">Need Help</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {students.reduce((acc, s) => acc + s.assignments.missing, 0)}
            </div>
            <div className="text-white font-medium">Missing Assignments</div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{student.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{student.name}</h3>
                      <p className="text-gray-400 text-sm">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${
                      student.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      student.status === 'struggling' ? 'bg-red-500/20 text-red-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {student.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{student.averageScore}%</div>
                      <div className="text-xs text-gray-400">Average</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Submitted:</span>
                    <span className="text-green-400 font-medium">{student.assignments.submitted}/{student.assignments.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Missing:</span>
                    <span className="text-red-400 font-medium">{student.assignments.missing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Last Active:</span>
                    <span className="text-gray-300">{student.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLabs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Lab Library</h2>
          <p className="text-gray-400">Assign virtual labs to students by grade level</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
            <option>All Grades</option>
            <option>Grade 6</option>
            <option>Grade 12</option>
          </select>
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            <Plus className="h-4 w-4 mr-2" />
            Assign Lab
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labsLibrary.map((lab) => (
          <Card key={lab.id} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  {lab.grade}
                </Badge>
                <Badge className={`${
                  lab.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300' :
                  lab.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {lab.difficulty}
                </Badge>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{lab.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{lab.description}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{lab.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FlaskConical className="h-4 w-4" />
                  <span>Virtual Lab</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">TOPICS:</p>
                <div className="flex flex-wrap gap-1">
                  {lab.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-cyan-600 text-cyan-300 hover:bg-cyan-500/20">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                  <Plus className="h-4 w-4 mr-1" />
                  Assign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400 font-medium">Loading teacher classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />

      <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Teacher Classroom</h1>
              <p className="text-gray-400">Advanced cybersecurity education platform</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                24 Students Online
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                CS6-2024 • Advanced Cybersecurity
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { id: 'classroom', label: 'Classroom', icon: Monitor },
              { id: 'ai-assistant', label: 'AI Assistant', icon: Brain },
              { id: 'quiz-builder', label: 'Quiz Builder', icon: FileText },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'labs', label: 'Lab Library', icon: FlaskConical }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium text-sm
                  ${currentTab === tab.id 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800/50'
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'classroom' && renderClassroom()}
        {currentTab === 'ai-assistant' && renderAiAssistant()}
        {currentTab === 'quiz-builder' && renderQuizBuilder()}
        {currentTab === 'students' && renderStudents()}
        {currentTab === 'labs' && renderLabs()}
      </div>

      {/* Announcement Modal */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Post Announcement</h3>
                <Button
                  onClick={() => setShowAnnouncementModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Title</Label>
                  <Input className="bg-gray-800/50 border-gray-600 text-white mt-1" placeholder="Announcement title..." />
                </div>
                <div>
                  <Label className="text-white">Message</Label>
                  <textarea 
                    className="w-full h-32 mt-1 p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                    placeholder="Type your message to students..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-300 text-sm">Pin to top</span>
                  </label>
                  <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                    <option>Normal Priority</option>
                    <option>Important</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => setShowAnnouncementModal(false)}
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                    <Send className="h-4 w-4 mr-2" />
                    Post Announcement
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 
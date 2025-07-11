'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Plus, Send, Trash2, Edit, Copy, Save, 
  ArrowLeft, DragDropContext, Droppable, Draggable,
  GripVertical, Clock, Users, Target, CheckCircle,
  AlertCircle, FileText, Sparkles, Wand2, BookOpen,
  Settings, Eye, Play, RotateCcw, HelpCircle,
  ChevronDown, ChevronUp, Type, List, PenTool
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/shared/Navbar';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  totalPoints: number;
  attempts: number;
  difficulty: 'easy' | 'medium' | 'hard';
  minQuestions: number;
  status: 'draft' | 'preview' | 'published';
}

interface AIMessage {
  id: string;
  content: string;
  sender: 'teacher' | 'ai';
  timestamp: Date;
}

export default function QuizBuilderPage() {
  const [user, setUser] = useState<any>(null);
  const [quiz, setQuiz] = useState<Quiz>({
    id: 'quiz-' + Date.now(),
    title: '',
    description: '',
    questions: [],
    timeLimit: 30,
    totalPoints: 0,
    attempts: 1,
    difficulty: 'medium',
    minQuestions: 5,
    status: 'draft'
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 10
  });

  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: '1',
      content: `Hello! I'm your AI quiz assistant. I can help you:

🎯 **Generate Questions**
- Multiple choice questions
- True/false questions  
- Essay prompts
- Short answer questions

📚 **Content Creation**
- Topic-specific questions
- Difficulty-appropriate content
- Detailed explanations
- Assessment rubrics

✨ **Smart Suggestions**
- Question improvements
- Answer option refinements
- Learning objective alignment

What topic would you like to create questions about?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const [aiMessage, setAiMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'teacher') {
        setUser({ ...userData, name: 'Sarah Johnson' });
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  useEffect(() => {
    setQuiz(prev => ({
      ...prev,
      totalPoints: prev.questions.reduce((sum, q) => sum + q.points, 0)
    }));
  }, [quiz.questions]);

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cybersecurity') || lowerMessage.includes('security')) {
      return `Here are some cybersecurity quiz questions:

**Multiple Choice:**
1. What is the primary purpose of a firewall?
   a) Speed up internet connection
   b) Filter network traffic based on security rules ✓
   c) Store user passwords  
   d) Encrypt data

2. Which of the following is a strong password?
   a) password123
   b) 123456
   c) P@ssw0rd2024! ✓
   d) admin

**True/False:**
3. Two-factor authentication provides an extra layer of security. (True)
4. Public Wi-Fi is always safe to use for banking. (False)

**Essay:**
5. Explain three best practices for maintaining cybersecurity in a workplace environment.

Would you like me to generate more questions or focus on a specific cybersecurity topic?`;
    }
    
    if (lowerMessage.includes('network') || lowerMessage.includes('networking')) {
      return `Here are networking-focused questions:

**Multiple Choice:**
1. What does IP stand for?
   a) Internet Provider
   b) Internet Protocol ✓
   c) Internal Process
   d) Information Packet

2. Which port is commonly used for HTTPS?
   a) 80
   b) 443 ✓
   c) 21
   d) 25

**Short Answer:**
3. Define what a subnet mask is and explain its purpose.
4. Name three types of network topologies.

Copy any questions you'd like to add to your quiz!`;
    }
    
    if (lowerMessage.includes('encryption') || lowerMessage.includes('crypto')) {
      return `Here are encryption/cryptography questions:

**Multiple Choice:**
1. What is symmetric encryption?
   a) Uses same key for encryption and decryption ✓
   b) Uses different keys for encryption and decryption
   c) Doesn't use keys
   d) Only encrypts, doesn't decrypt

**Essay:**
2. Compare and contrast symmetric vs asymmetric encryption methods.

**True/False:**
3. RSA is an example of symmetric encryption. (False)
4. AES is widely used for symmetric encryption. (True)

Feel free to copy these into your quiz builder!`;
    }
    
    return `I can help you create questions on various topics:

🔐 **Cybersecurity Topics:**
- Password security, firewalls, malware
- Social engineering, incident response
- Risk assessment, compliance

🌐 **Networking Topics:**
- TCP/IP, OSI model, routing
- Network security, protocols
- Wireless security, VPNs

📊 **General IT Topics:**
- Database security, cloud computing
- Operating systems, programming basics
- Digital forensics, system administration

What specific topic interests you? I'll generate targeted questions!`;
  };

  const handleAIMessage = async () => {
    if (!aiMessage.trim()) return;

    const newMessage: AIMessage = {
      id: Date.now().toString(),
      content: aiMessage,
      sender: 'teacher',
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, newMessage]);
    setAiMessage('');
    setIsAiTyping(true);

    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(aiMessage),
        sender: 'ai',
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 1500);
  };

  const addQuestion = () => {
    if (!currentQuestion.question?.trim()) return;

    const newQuestion: QuizQuestion = {
      id: 'q-' + Date.now(),
      question: currentQuestion.question,
      type: currentQuestion.type || 'multiple-choice',
      options: currentQuestion.type === 'true-false' 
        ? ['True', 'False']
        : currentQuestion.type === 'multiple-choice' 
        ? currentQuestion.options?.filter(opt => opt.trim()) || []
        : undefined,
      correctAnswer: currentQuestion.correctAnswer || 0,
      explanation: currentQuestion.explanation || '',
      points: currentQuestion.points || 10
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset form
    setCurrentQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10
    });
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const duplicateQuestion = (question: QuizQuestion) => {
    const newQuestion = {
      ...question,
      id: 'q-' + Date.now(),
      question: question.question + ' (Copy)'
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const reorderQuestions = (startIndex: number, endIndex: number) => {
    const result = Array.from(quiz.questions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setQuiz(prev => ({
      ...prev,
      questions: result
    }));
  };

  const copyQuestionFromAI = (questionText: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      question: questionText
    }));
  };

  const saveQuiz = () => {
    if (!quiz.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    
    if (quiz.questions.length < quiz.minQuestions) {
      alert(`Please add at least ${quiz.minQuestions} questions`);
      return;
    }

    // Save to localStorage or send to backend
    const savedQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    savedQuizzes.push(quiz);
    localStorage.setItem('teacherQuizzes', JSON.stringify(savedQuizzes));
    
    alert('Quiz saved successfully!');
  };

  const publishQuiz = () => {
    saveQuiz();
    setQuiz(prev => ({ ...prev, status: 'published' }));
    alert('Quiz published successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Quiz Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Quiz Builder */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push('/teacher/classroom')}
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:bg-slate-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Classroom
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Quiz Builder</h1>
                  <p className="text-slate-400">Create engaging assessments with AI assistance</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={`${
                  quiz.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                  quiz.status === 'published' ? 'bg-green-500/20 text-green-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                </Badge>
                <Button
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  onClick={saveQuiz}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Quiz
                </Button>
                <Button
                  onClick={publishQuiz}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>
          </div>

          {/* Quiz Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Quiz Settings */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Quiz Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white">Quiz Title *</Label>
                      <Input
                        value={quiz.title}
                        onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Network Security Assessment"
                        className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Difficulty Level</Label>
                      <select
                        value={quiz.difficulty}
                        onChange={(e) => setQuiz(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full mt-2 bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={quiz.description}
                      onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the quiz content and objectives..."
                      className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-white">Time Limit (minutes)</Label>
                      <Input
                        type="number"
                        value={quiz.timeLimit}
                        onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Minimum Questions Required</Label>
                      <Input
                        type="number"
                        value={quiz.minQuestions}
                        onChange={(e) => setQuiz(prev => ({ ...prev, minQuestions: parseInt(e.target.value) || 1 }))}
                        className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Allowed Attempts</Label>
                      <Input
                        type="number"
                        value={quiz.attempts}
                        onChange={(e) => setQuiz(prev => ({ ...prev, attempts: parseInt(e.target.value) || 1 }))}
                        className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Question Form */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-400" />
                    Add New Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Question Type</Label>
                      <select
                        value={currentQuestion.type}
                        onChange={(e) => setCurrentQuestion(prev => ({ 
                          ...prev, 
                          type: e.target.value as any,
                          options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined
                        }))}
                        className="w-full mt-2 bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-white">Points</Label>
                      <Input
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                        className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Question *</Label>
                    <Textarea
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter your question here..."
                      className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      rows={3}
                    />
                  </div>

                  {currentQuestion.type === 'multiple-choice' && (
                    <div>
                      <Label className="text-white">Answer Options</Label>
                      <div className="space-y-3 mt-2">
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={currentQuestion.correctAnswer === index}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                              className="text-green-500"
                            />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(currentQuestion.options || [])];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                              }}
                              placeholder={`Option ${index + 1}`}
                              className="bg-slate-800/50 border-slate-600 text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === 'true-false' && (
                    <div>
                      <Label className="text-white">Correct Answer</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tfAnswer"
                            checked={currentQuestion.correctAnswer === 0}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 0 }))}
                            className="text-green-500"
                          />
                          <span className="text-white">True</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tfAnswer"
                            checked={currentQuestion.correctAnswer === 1}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 1 }))}
                            className="text-green-500"
                          />
                          <span className="text-white">False</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-white">Explanation (Optional)</Label>
                    <Textarea
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      placeholder="Provide an explanation for the correct answer..."
                      className="bg-slate-800/50 border-slate-600 text-white mt-2"
                      rows={2}
                    />
                  </div>

                  <Button
                    onClick={addQuestion}
                    disabled={!currentQuestion.question?.trim()}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-purple-400" />
                      Questions ({quiz.questions.length})
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      Total Points: {quiz.totalPoints}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quiz.questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No questions added yet. Use the form above or copy from AI suggestions.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quiz.questions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex items-center gap-2 mt-1">
                                <GripVertical className="h-4 w-4 text-gray-500 cursor-move" />
                                <Badge variant="outline" className="text-xs">
                                  {index + 1}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium mb-2">{question.question}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span>Type: {question.type}</span>
                                  <span>Points: {question.points}</span>
                                  {question.type === 'multiple-choice' && (
                                    <span>Options: {question.options?.length}</span>
                                  )}
                                </div>
                                {question.explanation && (
                                  <p className="text-gray-400 text-sm mt-2">
                                    Explanation: {question.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => duplicateQuestion(question)}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteQuestion(question.id)}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="w-96 bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-l border-slate-700/50 flex flex-col">
          {/* AI Header */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">AI Assistant</h3>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className="text-gray-400 text-sm">Get AI-generated questions and suggestions</p>
          </div>

          {/* AI Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${message.sender === 'teacher' ? 'ml-4' : 'mr-4'}`}
              >
                <div className={`p-3 rounded-lg text-sm ${
                  message.sender === 'teacher'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-slate-700/50 text-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {isAiTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mr-4"
              >
                <div className="bg-slate-700/50 text-gray-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs">AI is generating...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAIMessage()}
                  placeholder="Ask for questions on any topic..."
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 text-sm"
                  disabled={isAiTyping}
                />
                <Button
                  onClick={handleAIMessage}
                  disabled={!aiMessage.trim() || isAiTyping}
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setAiMessage('Generate cybersecurity questions')}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Cybersecurity
                </Button>
                <Button
                  onClick={() => setAiMessage('Create networking questions')}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Networking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
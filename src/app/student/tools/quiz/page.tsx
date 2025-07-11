'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Clock, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, RotateCw, Trophy,
  Brain, Play, RefreshCw, Award, Zap,
  BookOpen, AlertCircle, TrendingUp, Users,
  Lightbulb, Star, Timer, ThumbsUp, ThumbsDown,
  BarChart3, TrendingDown, Crown, Check,
  Rocket, Shield, Save, Edit3, Plus, Search,
  Eye, Folder, Calendar, FileText, Archive, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile, Quiz, Question } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

type QuizMode = 'library' | 'create' | 'preview' | 'taking' | 'results';
type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

interface SavedQuiz {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number;
  createdAt: string;
  lastPlayed?: string;
  bestScore?: number;
  timesPlayed: number;
  questions: Question[];
}

interface QuizAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
  timeSpent: number;
}

interface QuizConfig {
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number;
}

const DEFAULT_QUIZZES: SavedQuiz[] = [
  {
    id: 'demo-1',
    title: 'Password Safety Quiz',
    description: 'Learn how to create super strong passwords and keep them safe!',
    topic: 'Password Security',
    difficulty: 'easy',
    questionCount: 5,
    timeLimit: 300,
    createdAt: '2024-01-15',
    lastPlayed: '2024-01-20',
    bestScore: 85,
    timesPlayed: 3,
    questions: []
  },
  {
    id: 'demo-2',
    title: 'Email Detective Challenge',
    description: 'Can you spot the suspicious emails? Test your detective skills!',
    topic: 'Email Safety',
    difficulty: 'medium',
    questionCount: 8,
    timeLimit: 480,
    createdAt: '2024-01-10',
    lastPlayed: '2024-01-18',
    bestScore: 92,
    timesPlayed: 5,
    questions: []
  },
  {
    id: 'demo-3',
    title: 'Social Media Safety Expert',
    description: 'Become a social media safety expert with this fun quiz!',
    topic: 'Social Media',
    difficulty: 'medium',
    questionCount: 6,
    timeLimit: 360,
    createdAt: '2024-01-05',
    bestScore: 78,
    timesPlayed: 2,
    questions: []
  }
];

const QUIZ_TOPICS = [
  { id: 'passwords', name: 'Password Security', emoji: '🔐', description: 'Creating and managing strong passwords' },
  { id: 'email-safety', name: 'Email Safety', emoji: '📧', description: 'Spotting and handling suspicious emails' },
  { id: 'social-media', name: 'Social Media Safety', emoji: '📱', description: 'Staying safe on social platforms' },
  { id: 'personal-info', name: 'Personal Information', emoji: '🛡️', description: 'Protecting your private details' },
  { id: 'cyberbullying', name: 'Cyberbullying', emoji: '💪', description: 'Handling online bullying situations' },
  { id: 'safe-browsing', name: 'Safe Browsing', emoji: '🌐', description: 'Finding trustworthy websites' }
];

export default function QuizPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [mode, setMode] = useState<QuizMode>('library');
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>(DEFAULT_QUIZZES);
  const [selectedQuiz, setSelectedQuiz] = useState<SavedQuiz | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [config, setConfig] = useState<QuizConfig>({
    title: '',
    topic: '',
    difficulty: 'medium',
    questionCount: 5,
    timeLimit: 300
  });
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        const saved = localStorage.getItem('savedQuizzes');
        if (saved) {
          setSavedQuizzes([...DEFAULT_QUIZZES, ...JSON.parse(saved)]);
        }
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (mode === 'taking' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeLeft]);

  const filteredQuizzes = savedQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'medium': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'hard': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '😊';
      case 'medium': return '🤔';
      case 'hard': return '🧠';
      default: return '⭐';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    return 'text-orange-400';
  };

  const generateQuiz = async (fromConfig?: QuizConfig) => {
    const useConfig = fromConfig || config;
    if (!useConfig.topic.trim()) {
      alert('Please choose a topic for your quiz!');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const questionTypes: QuestionType[] = ['multiple-choice', 'true-false'];
    
    const generateQuestion = (index: number): Question => {
      const questionType = questionTypes[index % questionTypes.length];
      const basePoints = useConfig.difficulty === 'easy' ? 10 : useConfig.difficulty === 'medium' ? 15 : 20;

      const topicQuestions = {
        'Password Security': [
          { q: 'What makes a password strong?', opts: ['Length and complexity', 'Using your name', 'Simple words', 'Your birthday'], correct: 0, exp: 'Strong passwords use a mix of letters, numbers, and symbols!' },
          { q: 'Should you share your password with friends?', opts: ['Yes, always', 'No, never', 'Only best friends', 'Sometimes'], correct: 1, exp: 'Never share passwords! They\'re like your secret key.' }
        ],
        'Email Safety': [
          { q: 'What should you do with emails from strangers?', opts: ['Open them right away', 'Delete without opening', 'Forward to friends', 'Reply immediately'], correct: 1, exp: 'Unknown emails might be dangerous. Always delete them!' },
          { q: 'How can you spot a suspicious email?', opts: ['Perfect spelling', 'Asks for passwords', 'From known people', 'Has pictures'], correct: 1, exp: 'Suspicious emails often ask for personal information like passwords.' }
        ],
        'Social Media Safety': [
          { q: 'Who should see your posts?', opts: ['Everyone online', 'Only people you know', 'Random strangers', 'Anyone who asks'], correct: 1, exp: 'Keep your posts private and only share with people you trust!' },
          { q: 'What information should you keep private?', opts: ['Your favorite color', 'Your home address', 'Your favorite movie', 'Your hobbies'], correct: 1, exp: 'Personal information like your address should always stay private!' }
        ]
      };

      const questions = topicQuestions[useConfig.topic as keyof typeof topicQuestions] || topicQuestions['Password Security'];
      const questionData = questions[index % questions.length];

      if (questionType === 'true-false') {
      return {
          id: `q-${index}`,
          type: 'multiple-choice',
          question: questionData.q,
          options: questionData.opts,
          correct: questionData.correct.toString(),
          explanation: questionData.exp,
          points: basePoints
        };
      }

      return {
        id: `q-${index}`,
        type: questionType,
        question: questionData.q,
        options: questionData.opts,
        correct: questionData.correct.toString(),
        explanation: questionData.exp,
        points: basePoints
      };
    };

    const questions = Array.from({ length: useConfig.questionCount }, (_, i) => generateQuestion(i));

    const newQuiz: Quiz = {
      id: 'quiz-' + Date.now(),
      title: useConfig.title,
      description: `A ${useConfig.difficulty} level quiz on ${useConfig.topic}`,
      questions,
      timeLimit: useConfig.timeLimit,
      createdBy: user?.id || 'student',
      createdAt: new Date(),
      tags: [useConfig.topic, useConfig.difficulty],
      difficulty: useConfig.difficulty,
      topic: useConfig.topic,
      points: questions.reduce((total, q) => total + q.points, 0)
    };

    setCurrentQuiz(newQuiz);
    setIsGenerating(false);
    setMode('preview');
  };

  const saveQuiz = () => {
    if (!currentQuiz) return;

    const savedQuiz: SavedQuiz = {
      id: currentQuiz.id,
      title: currentQuiz.title,
      description: currentQuiz.description,
      topic: config.topic,
      difficulty: config.difficulty,
      questionCount: currentQuiz.questions.length,
      timeLimit: currentQuiz.timeLimit || 300,
      createdAt: new Date().toISOString(),
      timesPlayed: 0,
      questions: currentQuiz.questions
    };

    const updated = [...savedQuizzes, savedQuiz];
    setSavedQuizzes(updated);
    localStorage.setItem('savedQuizzes', JSON.stringify(updated.filter(q => !DEFAULT_QUIZZES.find(d => d.id === q.id))));
    alert('Quiz saved to your library! 🎉');
  };

  const startQuiz = (savedQuiz: SavedQuiz | null = null) => {
    let quiz: Quiz;
    
    if (savedQuiz) {
      quiz = {
        id: savedQuiz.id,
        title: savedQuiz.title,
        description: savedQuiz.description,
        questions: savedQuiz.questions.length > 0 ? savedQuiz.questions : [],
        timeLimit: savedQuiz.timeLimit,
        difficulty: savedQuiz.difficulty,
        topic: savedQuiz.topic,
        points: savedQuiz.questions.reduce((total, q) => total + q.points, 0),
        passingScore: 70,
        createdBy: user?.id || 'student',
        createdAt: new Date(),
        tags: [savedQuiz.topic]
      };
      
      if (quiz.questions.length === 0) {
        alert('This quiz needs to be regenerated! Please create it again.');
        return;
      }
    } else {
      if (!currentQuiz) return;
      quiz = currentQuiz;
    }

    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowExplanation(false);
    setCurrentAnswerCorrect(null);
    setTimeLeft(quiz.timeLimit);
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setMode('taking');
  };

  const submitAnswer = () => {
    if (!currentQuiz || !selectedAnswer) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      correct: isCorrect,
      timeSpent
    };

    setAnswers(prev => [...prev, answer]);
    setCurrentAnswerCorrect(isCorrect);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setCurrentAnswerCorrect(null);
      setQuestionStartTime(Date.now());
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setMode('results');
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowExplanation(false);
    setCurrentAnswerCorrect(null);
    setTimeLeft(currentQuiz?.timeLimit || 300);
    setMode('taking');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading Quiz Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => {
                if (mode === 'taking' || mode === 'results') setMode('library');
                else if (mode === 'preview' || mode === 'create') setMode('library');
                else router.push('/student/tools');
              }}
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Quiz Builder</h1>
              <p className="text-slate-400">Create and practice with fun cybersecurity quizzes</p>
            </div>
          </div>
        </motion.div>

        {/* Quiz Library Mode */}
        {mode === 'library' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your Knowledge?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Choose from our fun quizzes or create your own custom quiz to practice cybersecurity skills!
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <Card className="bg-slate-800/50 border-slate-700 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer" onClick={() => setMode('create')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Create New Quiz</h3>
                      <p className="text-slate-400 text-sm">Build your own custom quiz</p>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Create
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Quick Challenge</h3>
                      <p className="text-slate-400 text-sm">Test your skills instantly</p>
            </div>
            <Button 
                      onClick={() => {
                        setConfig({ ...config, topic: 'Password Security', title: 'Quick Challenge' });
                        generateQuiz({ ...config, topic: 'Password Security', title: 'Quick Challenge' });
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Start
            </Button>
          </div>
                </CardContent>
              </Card>
        </motion.div>

            {/* Saved Quizzes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Your Quiz Collection</h2>
                <Badge className="bg-slate-800 text-slate-300">{savedQuizzes.length} quizzes</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/10" onClick={() => setSelectedQuiz(quiz)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{quiz.title}</h3>
                            <p className="text-slate-400 text-sm">
                              {typeof quiz.createdAt === 'string' ? quiz.createdAt : quiz.createdAt}
                            </p>
                          </div>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {getDifficultyEmoji(quiz.difficulty)} {quiz.difficulty}
                          </Badge>
                        </div>

                        <p className="text-slate-300 text-sm mb-4">{quiz.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{quiz.questionCount} questions</span>
                            <span>{Math.floor(quiz.timeLimit / 60)}m</span>
                          </div>
                          {quiz.bestScore && (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-yellow-400" />
                              <span className={`text-xs ${getScoreColor(quiz.bestScore)}`}>
                                {quiz.bestScore}%
                              </span>
                            </div>
                          )}
                        </div>

                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            startQuiz(quiz);
                          }}
                          className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                          <Play className="mr-1 h-4 w-4" />
                          Start Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Add New Quiz Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card 
                    className="bg-slate-800/30 border-slate-700 border-dashed border-slate-600 hover:border-slate-500 transition-all cursor-pointer h-full"
                    onClick={() => setMode('create')}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-slate-400" />
                      </div>
                      <h3 className="font-semibold text-slate-300 mb-2">Create New Quiz</h3>
                      <p className="text-slate-500 text-sm text-center">
                        Build a custom quiz on any topic
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Mode */}
        {mode === 'create' && (
          <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Quiz</h2>
              <p className="text-slate-400">Choose a topic and customize your learning experience</p>
            </motion.div>

            <Card className="kokonut-card bg-slate-900/50">
              <CardContent className="p-8 space-y-6">
                {/* Quiz Title */}
                  <div className="space-y-2">
                  <Label className="text-white text-lg">Quiz Title</Label>
                    <Input
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder="Give your quiz a fun name..."
                    className="h-12 bg-slate-800 border-slate-600 text-white text-lg"
                    />
                  </div>

                {/* Topic Selection */}
                <div className="space-y-4">
                  <Label className="text-white text-lg">Choose a Topic</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUIZ_TOPICS.map((topic) => (
                      <motion.button
                        key={topic.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfig({ ...config, topic: topic.name })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          config.topic === topic.name
                            ? 'bg-blue-500/20 border-blue-500 text-white'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{topic.emoji}</div>
                          <div>
                            <h3 className="font-semibold">{topic.name}</h3>
                            <p className="text-sm opacity-75">{topic.description}</p>
                    </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quiz Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="text-white">Difficulty</Label>
                    <div className="space-y-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                        <motion.button
                        key={level}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setConfig({ ...config, difficulty: level })}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            config.difficulty === level
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{getDifficultyEmoji(level)}</span>
                            <span className="capitalize font-medium">{level}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Questions</Label>
                    <Input
                      type="number"
                      value={config.questionCount}
                      onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) || 5 })}
                      min="3"
                      max="15"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <p className="text-slate-400 text-sm">3-15 questions</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Time Limit</Label>
                    <Input
                      type="number"
                      value={Math.floor(config.timeLimit / 60)}
                      onChange={(e) => setConfig({ ...config, timeLimit: (parseInt(e.target.value) || 5) * 60 })}
                      min="2"
                      max="30"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <p className="text-slate-400 text-sm">Minutes</p>
                  </div>
                </div>

                <Button
                  onClick={() => generateQuiz()}
                  disabled={isGenerating || !config.topic || !config.title.trim()}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Your Quiz...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preview Mode */}
        {mode === 'preview' && currentQuiz && (
          <div className="max-w-4xl mx-auto">
            <Card className="kokonut-card bg-slate-900/50">
                  <CardHeader>
                <CardTitle className="text-white text-2xl">{currentQuiz.title}</CardTitle>
                <CardDescription className="text-slate-400 text-lg">
                  {currentQuiz.description}
                </CardDescription>
                  </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{currentQuiz.questions.length}</div>
                    <div className="text-sm text-slate-400">Questions</div>
                      </div>
                      <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{formatTime(currentQuiz.timeLimit)}</div>
                    <div className="text-sm text-slate-400">Time Limit</div>
                      </div>
                      <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{currentQuiz.passingScore}%</div>
                    <div className="text-sm text-slate-400">Passing Score</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                    onClick={() => startQuiz()}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                    <Play className="mr-2 h-4 w-4" />
                        Start Quiz
                      </Button>
                      <Button
                    onClick={saveQuiz}
                        variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </div>
        )}

        {/* Taking Quiz Mode */}
        {mode === 'taking' && currentQuiz && currentQuiz.questions.length > 0 && (
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <Card className="kokonut-card bg-slate-900/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{currentQuiz.title}</h2>
                    <p className="text-slate-400">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400">
                      <Timer className="h-3 w-3 mr-1" />
                        {formatTime(timeLeft)}
                    </Badge>
                    <Progress value={(currentQuestionIndex / currentQuiz.questions.length) * 100} className="w-32 h-2 bg-slate-800" />
                      </div>
                    </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="kokonut-card bg-slate-900/50">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {currentQuiz.questions[currentQuestionIndex].question}
                    </h3>
                  </div>

                <div className="space-y-4 mb-8">
                  {currentQuiz.questions[currentQuestionIndex].options?.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAnswer(index.toString())}
                          disabled={showExplanation}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                        selectedAnswer === index.toString()
                          ? showExplanation
                            ? currentAnswerCorrect
                              ? 'bg-green-500/20 border-green-500 text-green-300'
                              : 'bg-red-500/20 border-red-500 text-red-300'
                            : 'bg-blue-500/20 border-blue-500 text-white'
                          : showExplanation && index.toString() === currentQuiz.questions[currentQuestionIndex].correct
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          selectedAnswer === index.toString()
                            ? showExplanation
                              ? currentAnswerCorrect
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-red-500 bg-red-500 text-white'
                              : 'border-blue-500 bg-blue-500 text-white'
                            : showExplanation && index.toString() === currentQuiz.questions[currentQuestionIndex].correct
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-slate-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                          </div>
                        <span className="font-medium">{option}</span>
                        {showExplanation && (
                          <div className="ml-auto">
                            {selectedAnswer === index.toString() && currentAnswerCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {selectedAnswer === index.toString() && !currentAnswerCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                            {index.toString() === currentQuiz.questions[currentQuestionIndex].correct && selectedAnswer !== index.toString() && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                  )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                  {showExplanation && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <Card className="bg-blue-500/10 border-blue-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-blue-400 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-300 mb-2">Explanation</h4>
                            <p className="text-slate-300">{currentQuiz.questions[currentQuestionIndex].explanation}</p>
                        </div>
                </div>
              </CardContent>
            </Card>
                  </motion.div>
                )}

                <div className="flex justify-center">
                {!showExplanation ? (
                  <Button
                    onClick={submitAnswer}
                      disabled={!selectedAnswer}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
              </CardContent>
            </Card>
            </div>
        )}

        {/* Results Mode */}
        {mode === 'results' && (
          <div className="max-w-4xl mx-auto text-center">
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
                  <div>
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-12 w-12 text-white" />
                    </div>
                <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete! 🎉</h2>
                <p className="text-xl text-slate-400">Great job on finishing the quiz!</p>
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="kokonut-card bg-green-500/10 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 text-green-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-300 mb-1">
                      {Math.round((answers.filter(a => a.correct).length / answers.length) * 100)}%
                    </div>
                    <div className="text-green-400">Final Score</div>
                  </CardContent>
                </Card>

                <Card className="kokonut-card bg-blue-500/10 border-blue-500/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-blue-300 mb-1">
                      {answers.filter(a => a.correct).length}/{answers.length}
                  </div>
                    <div className="text-blue-400">Correct Answers</div>
                  </CardContent>
                </Card>

                <Card className="kokonut-card bg-cyan-500/10 border-cyan-500/30">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-cyan-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-cyan-300 mb-1">
                      {formatTime((currentQuiz?.timeLimit || 0) - timeLeft)}
                    </div>
                    <div className="text-cyan-400">Time Used</div>
                  </CardContent>
                </Card>
                </div>

              <div className="flex gap-4 justify-center">
                  <Button
                  onClick={restartQuiz}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                  </Button>
                  <Button
                  onClick={() => setMode('library')}
                    variant="outline"
                  className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Back to Library
                  </Button>
                </div>
            </motion.div>
                          </div>
        )}
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, RotateCcw, Check, X, 
  ChevronLeft, ChevronRight, Shuffle, 
  BookOpen, Clock, Target, Zap, Play,
  RefreshCw, Save, Share, Settings, ArrowLeft,
  Layers, Eye, EyeOff, Star, TrendingUp,
  Award, Cpu, Lightbulb, Flame, Crown,
  Timer, BarChart3, Users, Volume2, VolumeX,
  Pause, SkipForward, SkipBack, Repeat, CheckCircle,
  Wand2, Beaker, Code, Shield, Trophy, Plus,
  Library, FolderOpen, FileText, Infinity,
  Heart, Smile, ThumbsUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile, Flashcard, FlashcardSet } from '@/lib/types';
import { demoStudent, demoFlashcardSet } from '@/lib/demo-data';
import { toast } from 'react-hot-toast';

type StudyMode = 'library' | 'create' | 'study' | 'adaptive' | 'review' | 'setup';
type FlashcardSide = 'front' | 'back';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

// 6th grade appropriate cybersecurity topics from studied units
const GRADE_APPROPRIATE_TOPICS = [
  { id: 'internet-safety', name: 'Internet Safety', description: 'How to stay safe online' },
  { id: 'passwords', name: 'Strong Passwords', description: 'Creating super strong passwords' },
  { id: 'stranger-danger', name: 'Online Strangers', description: 'Being careful with people online' },
  { id: 'personal-info', name: 'Personal Information', description: 'What not to share online' },
  { id: 'safe-websites', name: 'Safe Websites', description: 'How to spot trustworthy websites' },
  { id: 'email-safety', name: 'Email Safety', description: 'Spotting suspicious emails' },
  { id: 'cyberbullying', name: 'Cyberbullying', description: 'How to handle online bullying' },
  { id: 'digital-footprint', name: 'Digital Footprint', description: 'What you leave behind online' },
];

// Sample saved flashcard sets
const SAVED_FLASHCARD_SETS: FlashcardSet[] = [
  {
    id: 'saved-1',
    title: 'Internet Safety Basics',
    description: 'Essential rules for staying safe online',
    cards: [],
    createdBy: 'student-1',
    createdAt: new Date('2024-06-15'),
    public: false,
    tags: ['internet-safety', 'basics'],
  },
  {
    id: 'saved-2', 
    title: 'Password Power Quiz',
    description: 'Test your password creation skills',
    cards: [],
    createdBy: 'student-1',
    createdAt: new Date('2024-06-10'),
    public: false,
    tags: ['passwords', 'strength'],
  },
  {
    id: 'saved-3',
    title: 'Spotting Bad Emails',
    description: 'Learn to identify suspicious messages',
    cards: [],
    createdBy: 'student-1',
    createdAt: new Date('2024-06-05'),
    public: false,
    tags: ['email-safety', 'phishing'],
  },
];

export default function FlashcardsPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [mode, setMode] = useState<StudyMode>('library');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [savedSets, setSavedSets] = useState<FlashcardSet[]>(SAVED_FLASHCARD_SETS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSide, setCurrentSide] = useState<FlashcardSide>('front');
  const [isFlipping, setIsFlipping] = useState(false);
  const [studyStats, setStudyStats] = useState({ correct: 0, incorrect: 0, remaining: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [sessionTime, setSessionTime] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000);
  const [showHints, setShowHints] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Adaptive learning state
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [adaptiveCorrectStreak, setAdaptiveCorrectStreak] = useState(0);
  const [adaptiveQuestionCount, setAdaptiveQuestionCount] = useState(0);
  const [adaptiveTopic, setAdaptiveTopic] = useState('');
  
  // Add state for endless mode popup
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  
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

  // Timer for session tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'study' || mode === 'adaptive') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && (mode === 'study' || mode === 'adaptive') && flashcardSet) {
      interval = setInterval(() => {
        if (currentSide === 'front') {
          flipCard();
        } else {
          nextCard();
        }
      }, autoPlaySpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentSide, autoPlaySpeed, mode, flashcardSet]);

  const generateAdaptiveCard = (topic: string, difficulty: DifficultyLevel) => {
    const topicData = GRADE_APPROPRIATE_TOPICS.find(t => t.id === topic);
    if (!topicData) return null;

    const questionTemplates = {
      'internet-safety': [
        { q: 'What should you do if a website asks for your home address?', a: 'Never give your home address to websites unless your parents say it\'s okay. Ask a grown-up first!' },
        { q: 'Is it safe to click on popup ads?', a: 'No! Popup ads can be tricks. Close them by clicking the X in the corner, and tell an adult if they keep appearing.' },
        { q: 'What should you do if someone online asks to meet you?', a: 'Never meet someone from the internet in real life without your parents. Tell a trusted adult right away.' },
      ],
      'passwords': [
        { q: 'How long should a good password be?', a: 'At least 8 characters long, but longer is better! Use a mix of letters, numbers, and symbols.' },
        { q: 'Should you use your pet\'s name as a password?', a: 'No! Passwords should not be easy to guess. Don\'t use names, birthdays, or favorite things.' },
        { q: 'What is a password manager?', a: 'A special app that remembers all your passwords safely, so you only need to remember one master password.' },
      ],
      'stranger-danger': [
        { q: 'If someone online says they want to be your friend, what should you do?', a: 'Be careful! Don\'t share personal information. Talk to your parents or teacher about new online friends.' },
        { q: 'Is it okay to tell someone online your school name?', a: 'No! Your school name is personal information. Keep it private to stay safe.' },
      ],
      'personal-info': [
        { q: 'What personal information should you never share online?', a: 'Never share your full name, address, phone number, school name, or where you hang out.' },
        { q: 'Is your favorite color personal information?', a: 'Your favorite color is usually okay to share, but be careful about sharing too many details about yourself.' },
      ],
      'safe-websites': [
        { q: 'How can you tell if a website is safe?', a: 'Look for "https://" and a lock symbol in the address bar. Ask an adult if you\'re not sure!' },
        { q: 'What should you do if a website looks scary or inappropriate?', a: 'Close it right away and tell a trusted adult. You did nothing wrong by accidentally finding it.' },
      ],
      'email-safety': [
        { q: 'Should you open emails from people you don\'t know?', a: 'No! Unknown emails might be dangerous. Only open emails from people you and your parents know.' },
        { q: 'What is spam email?', a: 'Junk email that tries to trick you or sell you things. Delete spam emails without opening them.' },
      ],
      'cyberbullying': [
        { q: 'What should you do if someone is mean to you online?', a: 'Don\'t respond to mean messages. Block the person, save evidence, and tell a trusted adult right away.' },
        { q: 'Is it okay to say mean things online because it\'s "just the internet"?', a: 'No! Being mean online hurts people just like being mean in person. Always be kind online.' },
      ],
      'digital-footprint': [
        { q: 'What is a digital footprint?', a: 'Everything you do online leaves a trace, like footprints in sand. This includes photos, comments, and websites you visit.' },
        { q: 'Can you delete things from the internet?', a: 'Sometimes, but not always. That\'s why it\'s important to think before you post anything online.' },
      ],
    };

    const templates = questionTemplates[topic as keyof typeof questionTemplates] || [];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    if (!randomTemplate) return null;

    return {
      id: `adaptive-${Date.now()}-${Math.random()}`,
      front: randomTemplate.q,
      back: randomTemplate.a,
      difficulty,
      tags: [topic],
      correctCount: 0,
      totalCount: 0,
    };
  };

  const generateFlashcards = async (topic?: string, isAdaptive: boolean = false) => {
    const targetTopic = topic || selectedTopic || customTopic;
    if (!targetTopic.trim()) {
      toast.error('Please enter a topic to generate flashcards');
      return;
    }

    setIsGenerating(true);
    setMode('create');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    let generatedCards: Flashcard[] = [];

    if (isAdaptive) {
      // Generate single card for adaptive mode
      const card = generateAdaptiveCard(targetTopic, difficulty);
      if (card) {
        generatedCards = [card];
      }
    } else {
      // Generate full set for regular study
      const cardCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
      for (let i = 0; i < cardCount; i++) {
        const card = generateAdaptiveCard(targetTopic, difficulty);
        if (card) {
          generatedCards.push({ ...card, id: `gen-${i}-${Date.now()}` });
        }
      }
    }

    const topicData = GRADE_APPROPRIATE_TOPICS.find(t => t.id === targetTopic);
    const newSet: FlashcardSet = {
      id: 'generated-' + Date.now(),
      title: topicData ? topicData.name : targetTopic,
      description: topicData ? topicData.description : `Learning about ${targetTopic}`,
      cards: generatedCards,
      createdBy: user?.id || 'current-user',
      createdAt: new Date(),
      public: false,
      tags: [targetTopic.toLowerCase()],
    };

    setFlashcardSet(newSet);
    setStudyStats({ 
      correct: 0, 
      incorrect: 0, 
      remaining: generatedCards.length 
    });
    
    if (isAdaptive) {
      setMode('adaptive');
      setAdaptiveTopic(targetTopic);
      setAdaptiveQuestionCount(1);
    } else {
    setMode('study');
    }
    
    setIsGenerating(false);
    setSessionTime(0);
    
    toast.success(`Generated ${generatedCards.length} flashcards about ${targetTopic}!`, {
      icon: '🧠',
      style: { 
        background: 'linear-gradient(135deg, #00ff41, #00d4ff)',
        color: 'white'
      }
    });
  };

  const startAdaptiveMode = (topic: string) => {
    setAdaptiveMode(true);
    setAdaptiveCorrectStreak(0);
    setAdaptiveQuestionCount(0);
    generateFlashcards(topic, true);
  };

  const handleAdaptiveAnswer = (correct: boolean) => {
    setAdaptiveQuestionCount(prev => prev + 1);
    
    if (correct) {
      setAdaptiveCorrectStreak(prev => prev + 1);
      setStudyStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setAdaptiveCorrectStreak(0);
      setStudyStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Show popup every 10 questions
    const newQuestionCount = adaptiveQuestionCount + 1;
    if (newQuestionCount % 10 === 0) {
      setShowProgressPopup(true);
      setTimeout(() => {
        setShowProgressPopup(false);
      }, 3000);
    }

    // Generate next question after a short delay
    setTimeout(() => {
      generateFlashcards(adaptiveTopic, true);
      setCurrentSide('front');
    }, 1500);
  };

  const flipCard = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    
    setTimeout(() => {
      setCurrentSide(currentSide === 'front' ? 'back' : 'front');
    }, 300);
    
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  const nextCard = () => {
    if (!flashcardSet || currentCardIndex >= flashcardSet.cards.length - 1) return;
    setCurrentCardIndex(prev => prev + 1);
    setCurrentSide('front');
  };

  const prevCard = () => {
    if (currentCardIndex <= 0) return;
    setCurrentCardIndex(prev => prev - 1);
    setCurrentSide('front');
  };

  const shuffleCards = () => {
    if (!flashcardSet) return;
    const shuffled = [...flashcardSet.cards].sort(() => Math.random() - 0.5);
    setFlashcardSet({ ...flashcardSet, cards: shuffled });
    setCurrentCardIndex(0);
    setCurrentSide('front');
  };

  const saveFlashcardSet = () => {
    if (!flashcardSet) return;
    
    const newSet: FlashcardSet = {
      ...flashcardSet,
      id: 'saved-' + Date.now(),
      createdAt: new Date(),
    };
    
    setSavedSets(prev => [newSet, ...prev]);
    alert('Flashcard set saved to your library! 📚');
  };

  const loadSavedSet = (set: FlashcardSet) => {
    // For demo, load with sample cards
    const sampleCards = generateSampleCards(set.tags[0] || 'internet-safety');
    setFlashcardSet({ ...set, cards: sampleCards });
    setStudyStats({ 
      correct: 0, 
      incorrect: 0, 
      remaining: sampleCards.length 
    });
    setCurrentCardIndex(0);
    setCurrentSide('front');
    setMode('study');
    setSessionTime(0);
  };

  const generateSampleCards = (topic: string): Flashcard[] => {
    const card = generateAdaptiveCard(topic, 'medium');
    if (!card) return [];
    
    return Array.from({ length: 5 }, (_, i) => ({
      ...card,
      id: `sample-${i}`,
      front: `${card.front} (Question ${i + 1})`,
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-blue-400 to-cyan-500';
      case 'hard': return 'from-orange-400 to-red-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  const getDifficultyEmoji = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy': return '😊';
      case 'medium': return '🤔';
      case 'hard': return '🧠';
      default: return '⭐';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading your learning space...</p>
        </div>
      </div>
    );
  }

  // Library Mode - Main landing page
  if (mode === 'library') {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar user={user} />
      
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Memory Cards</h1>
                <p className="text-slate-400">Create, study, and master cybersecurity concepts</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="kokonut-card border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Quick Study</h3>
                    <p className="text-slate-400 text-sm">Start learning right away</p>
                  </div>
                  <Button 
                    onClick={() => setMode('setup')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="kokonut-card border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Endless Mode</h3>
                    <p className="text-slate-400 text-sm">Practice until perfect</p>
                  </div>
                  <Button 
                    onClick={() => startAdaptiveMode('internet-safety')}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="kokonut-card border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Challenge Mode</h3>
                    <p className="text-slate-400 text-sm">Test your skills</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setDifficulty('hard');
                      setMode('setup');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Challenge
                  </Button>
      </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Saved Sets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Collections</h2>
              <Badge className="bg-slate-800 text-slate-300">{savedSets.length} sets</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSets.map((set, index) => (
          <motion.div
                  key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="kokonut-card bg-slate-900/50 hover:bg-slate-800/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{set.title}</h3>
                          <p className="text-slate-400 text-sm">
                            {set.createdAt instanceof Date ? set.createdAt.toLocaleDateString() : new Date(set.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-4">{set.description}</p>
                      <div className="flex gap-2">
              <Button
                          onClick={() => loadSavedSet(set)}
                          size="sm"
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Study
                        </Button>
                        <Button 
                          size="sm"
                variant="outline"
                          className="border-slate-600 text-slate-400 hover:bg-slate-800"
              >
                          <Eye className="h-4 w-4" />
              </Button>
              </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add New Set Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card 
                  className="kokonut-card bg-slate-900/30 border-dashed border-slate-600 hover:border-slate-500 transition-all cursor-pointer h-full"
                  onClick={() => setMode('setup')}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-300 mb-2">Create New Set</h3>
                    <p className="text-slate-500 text-sm text-center">
                      Start a new learning adventure
                    </p>
                  </CardContent>
                </Card>
          </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Setup Mode
  if (mode === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar user={user} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setMode('library')}
                variant="outline"
                className="border-slate-600 text-slate-400 hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Create Flashcards</h1>
                <p className="text-slate-400">Choose a topic and difficulty level</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topic Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="kokonut-card bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    Choose Your Topic
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {GRADE_APPROPRIATE_TOPICS.map((topic) => (
                      <motion.button
                        key={topic.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTopic === topic.id
                            ? 'bg-blue-500/20 border-blue-500 text-white'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <h3 className="font-semibold mb-1">{topic.name}</h3>
                        <p className="text-sm opacity-75">{topic.description}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Topic */}
                  <div className="pt-4 border-t border-slate-700">
                    <Label className="text-slate-300 mb-2 block">Custom Topic</Label>
                      <Input
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter your own topic..."
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Difficulty & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="kokonut-card bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-400" />
                    Difficulty Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
                        <motion.button
                          key={level}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                          onClick={() => setDifficulty(level)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            difficulty === level
                            ? `bg-gradient-to-r ${getDifficultyColor(level)} text-white border-transparent`
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getDifficultyEmoji(level)}</div>
                          <div className="text-left">
                            <div className="font-semibold capitalize">{level}</div>
                            <div className="text-sm opacity-75">
                              {level === 'easy' ? '5 questions' : level === 'medium' ? '8 questions' : '12 questions'}
                            </div>
                          </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                </CardContent>
              </Card>

                  {/* Action Buttons */}
              <div className="space-y-4">
                      <Button
                  onClick={() => generateFlashcards()}
                  disabled={isGenerating || (!selectedTopic && !customTopic.trim())}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Cards...
                          </>
                        ) : (
                          <>
                      <Brain className="mr-2 h-4 w-4" />
                      Create Flashcards
                          </>
                        )}
                      </Button>
                    
                      <Button
                  onClick={() => {
                    const topic = selectedTopic || 'internet-safety';
                    startAdaptiveMode(topic);
                  }}
                  disabled={!selectedTopic && !customTopic.trim()}
                        variant="outline"
                  className="w-full h-12 border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                  <Zap className="mr-2 h-4 w-4" />
                  Endless Mode
                      </Button>
                  </div>
                      </motion.div>
                  </div>
        </main>
      </div>
    );
  }

  // Generation Mode
  if (mode === 'create' && isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
            <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY }
            }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Brain className="h-10 w-10 text-white" />
                  </motion.div>
                  
          <h2 className="text-2xl font-bold text-white mb-4">
            Creating your flashcards...
          </h2>
          
                      <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-slate-400 text-lg mb-8"
          >
            Working on "{selectedTopic ? GRADE_APPROPRIATE_TOPICS.find(t => t.id === selectedTopic)?.name : customTopic}"
                      </motion.div>

          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2
                }}
              />
            ))}
                      </div>
                        </div>
                        </div>
    );
  }

  // Study Mode
  if (mode === 'study' && flashcardSet) {
    const currentCard = flashcardSet.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / flashcardSet.cards.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar user={user} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
                          <Button
                onClick={() => setMode('library')}
                            variant="outline"
                className="border-slate-600 text-slate-400 hover:bg-slate-800"
                          >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
                          </Button>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400 px-3 py-1 rounded-xl">
                  <Timer className="h-3 w-3 mr-1" />
                  {formatTime(sessionTime)}
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400 px-3 py-1 rounded-xl">
                  {currentCardIndex + 1} / {flashcardSet.cards.length}
                </Badge>
                          <Button
                  onClick={saveFlashcardSet}
                            size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 rounded-xl"
                          >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                          </Button>
              </div>
                        </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Study Progress</span>
                <span>{Math.round(progress)}% Complete</span>
                      </div>
              <Progress value={progress} className="h-3 bg-slate-800 rounded-full" />
                    </div>
          </motion.div>

          {/* Study Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-green-500/10 border-green-500/30 rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-300">{studyStats.correct}</div>
                <div className="text-sm text-green-400">Got Right!</div>
                  </CardContent>
                </Card>
            <Card className="bg-orange-500/10 border-orange-500/30 rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-300">{studyStats.incorrect}</div>
                <div className="text-sm text-orange-400">Learning</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/30 rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-300">{studyStats.remaining}</div>
                <div className="text-sm text-blue-400">Left to Go</div>
              </CardContent>
            </Card>
          </motion.div>

                {/* Flashcard */}
                  <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
                  >
                    <motion.div
              key={currentCardIndex}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative perspective-1000"
            >
              <motion.div
                className="relative w-full h-[300px] cursor-pointer"
                      onClick={flipCard}
                animate={{ rotateY: currentSide === 'back' ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.02 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Card */}
                <Card 
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 rounded-3xl shadow-lg ${
                    currentSide === 'front' ? 'block' : 'hidden'
                  }`}
                >
                  <CardContent className="p-8 flex flex-col justify-center items-center text-center h-full">
                    <div className="mb-4">
                      <Badge className={`bg-gradient-to-r ${getDifficultyColor(currentCard.difficulty)} text-white px-4 py-2 rounded-xl`}>
                        {getDifficultyEmoji(currentCard.difficulty)} {currentCard.difficulty.toUpperCase()}
                            </Badge>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
                        {currentCard.front}
                      </h3>
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="text-cyan-300 text-sm"
                      >
                        Click to see the answer!
                      </motion.div>
                          </div>
                        </CardContent>
                      </Card>

                {/* Back of Card */}
                <Card 
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 rounded-3xl shadow-lg ${
                    currentSide === 'back' ? 'block' : 'hidden'
                  }`}
                >
                  <CardContent className="p-8 flex flex-col justify-center items-center text-center h-full">
                    <div className="mb-4">
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-xl">
                              Answer
                            </Badge>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {currentCard.back}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
              </motion.div>
                    </motion.div>
                  </motion.div>

          {/* Study Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={prevCard}
                        disabled={currentCardIndex === 0}
                        variant="outline"
                size="lg"
                className="border-slate-600 text-slate-400 hover:bg-slate-800 disabled:opacity-30 rounded-xl"
                      >
                <ChevronLeft className="h-5 w-5" />
                      </Button>

              <Button
                onClick={flipCard}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 rounded-xl"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Flip Card
              </Button>

                      <Button
                        onClick={nextCard}
                        disabled={currentCardIndex === flashcardSet.cards.length - 1}
                        variant="outline"
                size="lg"
                className="border-slate-600 text-slate-400 hover:bg-slate-800 disabled:opacity-30 rounded-xl"
                      >
                <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

            {/* Answer Feedback */}
                    {currentSide === 'back' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4"
                      >
                        <Button
                          onClick={() => markCard(false)}
                  variant="outline"
                  size="lg"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 rounded-xl"
                        >
                  <X className="mr-2 h-5 w-5" />
                  Need Practice
                        </Button>

                        <Button
                          onClick={() => markCard(true)}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl"
                        >
                  <Check className="mr-2 h-5 w-5" />
                  Got It!
                        </Button>
                      </motion.div>
                    )}

            {/* Study Tools */}
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                variant="outline"
                size="sm"
                className={`border-slate-600 text-slate-400 rounded-xl ${isAutoPlay ? 'text-green-300 border-green-300' : ''}`}
              >
                {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={shuffleCards}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-400 hover:text-slate-200 rounded-xl"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
                  </div>
          </motion.div>
        </main>
                </div>
    );
  }

  // Adaptive Mode
  if (mode === 'adaptive' && flashcardSet) {
    const currentCard = flashcardSet.cards[0]; // Always show the current generated card

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar user={user} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Popup */}
          {showProgressPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-xl border border-blue-400/50 rounded-2xl p-8 text-center shadow-2xl">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Hold On!</h3>
                <p className="text-blue-100 text-sm">Tailoring your flashcards based on your results...</p>
              </div>
            </motion.div>
          )}

          {/* Header with Adaptive Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={() => setMode('library')}
                variant="outline"
                className="border-slate-600 text-slate-400 hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                End Session
              </Button>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400 px-3 py-1 rounded-xl">
                  <Infinity className="h-3 w-3 mr-1" />
                  Endless Mode
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400 px-3 py-1 rounded-xl">
                  <Timer className="h-3 w-3 mr-1" />
                  {formatTime(sessionTime)}
                </Badge>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-300">{adaptiveQuestionCount}</div>
                    <div className="text-sm text-cyan-400">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-300">{studyStats.correct}</div>
                    <div className="text-sm text-green-400">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-300">{adaptiveCorrectStreak}</div>
                    <div className="text-sm text-orange-400">Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-300">
                      {studyStats.correct + studyStats.incorrect > 0 ? Math.round((studyStats.correct / (studyStats.correct + studyStats.incorrect)) * 100) : 0}%
                    </div>
                    <div className="text-sm text-blue-400">Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

          {/* Current Question Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
            >
                  <motion.div
              key={currentCard.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <motion.div
                className="relative w-full h-[350px] cursor-pointer"
                onClick={flipCard}
                animate={{ rotateY: currentSide === 'back' ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Card */}
                <Card 
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 rounded-3xl shadow-xl ${
                    currentSide === 'front' ? 'block' : 'hidden'
                  }`}
                >
                  <CardContent className="p-8 flex flex-col justify-center items-center text-center h-full">
                    <div className="mb-6">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Infinity className="h-8 w-8 text-white" />
                  </motion.div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl">
                        Question #{adaptiveQuestionCount}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
                        {currentCard.front}
                      </h3>
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="text-cyan-300 text-sm"
                      >
                        Click to reveal the answer!
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                {/* Back of Card */}
                <Card 
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 rounded-3xl shadow-xl ${
                    currentSide === 'back' ? 'block' : 'hidden'
                  }`}
                >
                  <CardContent className="p-8 flex flex-col justify-center items-center text-center h-full">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-xl">
                        Answer
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-lg text-slate-300 leading-relaxed mb-8">
                        {currentCard.back}
                      </p>

                      {/* Quick Answer Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4"
                      >
                        <Button
                          onClick={() => markCard(false)}
                          size="lg"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl px-8"
                        >
                          <X className="mr-2 h-5 w-5" />
                          Still Learning
                        </Button>

                        <Button
                          onClick={() => markCard(true)}
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl px-8"
                        >
                          <Check className="mr-2 h-5 w-5" />
                          I Know This!
                        </Button>
                      </motion.div>
                      </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Encouragement Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 rounded-2xl">
              <CardContent className="p-6">
                <p className="text-slate-300">
                  {adaptiveCorrectStreak >= 5 ? 
                    "Amazing! You're on fire! 🔥" :
                    adaptiveCorrectStreak >= 3 ? 
                    "Great job! Keep it up! 🌟" :
                    "You're doing great! Keep learning! 📚"
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </main>
                    </div>
    );
  }

  // Review Mode
  if (mode === 'review') {
    const accuracy = studyStats.correct + studyStats.incorrect > 0 
      ? (studyStats.correct / (studyStats.correct + studyStats.incorrect)) * 100 
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar user={user} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Trophy className="h-12 w-12 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Great Job! 🎉
              </h1>
              <p className="text-lg text-slate-400 mb-8">
                You completed studying "{flashcardSet?.title}"
              </p>
                    </div>
            
            {/* Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-green-500/10 border-green-500/30 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 text-green-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-300 mb-1">{accuracy.toFixed(1)}%</div>
                    <div className="text-green-400">Accuracy</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-blue-500/10 border-blue-500/30 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-blue-300 mb-1">{formatTime(sessionTime)}</div>
                    <div className="text-blue-400">Study Time</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-cyan-500/10 border-cyan-500/30 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 text-cyan-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-cyan-300 mb-1">{studyStats.correct}</div>
                    <div className="text-cyan-400">Cards Mastered</div>
                  </CardContent>
                </Card>
              </motion.div>
                  </div>
                  
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                    <Button
                      onClick={() => {
                        setMode('study');
                        setCurrentCardIndex(0);
                        setCurrentSide('front');
                  setStudiedCards(new Set());
                        setStudyStats({ correct: 0, incorrect: 0, remaining: flashcardSet?.cards.length || 0 });
                        setSessionTime(0);
                      }}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-2xl"
                    >
                <RefreshCw className="mr-2 h-5 w-5" />
                      Study Again
                    </Button>
              
                    <Button
                onClick={() => setMode('library')}
                      variant="outline"
                size="lg"
                className="border-slate-600 text-slate-400 hover:bg-slate-800 rounded-2xl"
                    >
                <Library className="mr-2 h-5 w-5" />
                Back to Library
                    </Button>
            </motion.div>
          </motion.div>
        </main>
    </div>
  );
  }

  return null;
} 
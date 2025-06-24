'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, RotateCcw, Check, X, 
  ChevronLeft, ChevronRight, Shuffle, 
  BookOpen, Clock, Target, Zap, Play,
  RefreshCw, Save, Share, Settings
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

type StudyMode = 'create' | 'study' | 'review';
type FlashcardSide = 'front' | 'back';

export default function FlashcardsPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [mode, setMode] = useState<StudyMode>('create');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSide, setCurrentSide] = useState<FlashcardSide>('front');
  const [isFlipping, setIsFlipping] = useState(false);
  const [studyStats, setStudyStats] = useState({ correct: 0, incorrect: 0, remaining: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
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

  // Simulate AI flashcard generation
  const generateFlashcards = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic to generate flashcards');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate contextual flashcards based on topic
    const generatedCards: Flashcard[] = [
      {
        id: 'gen-1',
        front: `What is ${topic}?`,
        back: `${topic} is a fundamental concept in cybersecurity that involves protecting systems and data from unauthorized access and threats.`,
        difficulty,
        tags: [topic.toLowerCase(), 'definition'],
        correctCount: 0,
        totalCount: 0,
      },
      {
        id: 'gen-2',
        front: `What are the key components of ${topic}?`,
        back: `Key components include implementation, monitoring, and maintenance of security protocols related to ${topic}.`,
        difficulty,
        tags: [topic.toLowerCase(), 'components'],
        correctCount: 0,
        totalCount: 0,
      },
      {
        id: 'gen-3',
        front: `How does ${topic} impact cybersecurity?`,
        back: `${topic} significantly impacts cybersecurity by providing essential protection mechanisms and reducing attack vectors.`,
        difficulty,
        tags: [topic.toLowerCase(), 'impact'],
        correctCount: 0,
        totalCount: 0,
      },
      {
        id: 'gen-4',
        front: `What are common challenges with ${topic}?`,
        back: `Common challenges include implementation complexity, maintenance overhead, and keeping up with evolving threats.`,
        difficulty,
        tags: [topic.toLowerCase(), 'challenges'],
        correctCount: 0,
        totalCount: 0,
      },
      {
        id: 'gen-5',
        front: `Best practices for ${topic}?`,
        back: `Best practices include regular updates, proper configuration, continuous monitoring, and staff training.`,
        difficulty,
        tags: [topic.toLowerCase(), 'best-practices'],
        correctCount: 0,
        totalCount: 0,
      },
    ];

    const newSet: FlashcardSet = {
      id: 'generated-' + Date.now(),
      title: `${topic} Essentials`,
      description: `AI-generated flashcards covering key concepts about ${topic}`,
      cards: generatedCards,
      createdBy: user?.id || 'current-user',
      createdAt: new Date(),
      public: false,
      tags: [topic.toLowerCase(), 'ai-generated'],
    };

    setFlashcardSet(newSet);
    setStudyStats({ 
      correct: 0, 
      incorrect: 0, 
      remaining: generatedCards.length 
    });
    setMode('study');
    setIsGenerating(false);
    
    toast.success(`Generated ${generatedCards.length} flashcards about ${topic}!`);
  };

  const flipCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSide(currentSide === 'front' ? 'back' : 'front');
      setIsFlipping(false);
    }, 300);
  };

  const markCard = (correct: boolean) => {
    if (!flashcardSet) return;

    const newStudiedCards = new Set(studiedCards);
    newStudiedCards.add(currentCardIndex);
    setStudiedCards(newStudiedCards);

    setStudyStats(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: !correct ? prev.incorrect + 1 : prev.incorrect,
      remaining: Math.max(0, prev.remaining - 1)
    }));

    // Update card statistics
    const updatedCards = [...flashcardSet.cards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      correctCount: correct ? updatedCards[currentCardIndex].correctCount + 1 : updatedCards[currentCardIndex].correctCount,
      totalCount: updatedCards[currentCardIndex].totalCount + 1,
      lastReviewed: new Date(),
    };

    setFlashcardSet({
      ...flashcardSet,
      cards: updatedCards,
    });

    // Move to next card or finish
    if (currentCardIndex < flashcardSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCurrentSide('front');
    } else {
      // Study session complete
      setMode('review');
      toast.success('Study session complete! 🎉');
    }
  };

  const shuffleCards = () => {
    if (!flashcardSet) return;
    const shuffled = [...flashcardSet.cards].sort(() => Math.random() - 0.5);
    setFlashcardSet({ ...flashcardSet, cards: shuffled });
    setCurrentCardIndex(0);
    setCurrentSide('front');
    toast.success('Cards shuffled!');
  };

  const loadDemoSet = () => {
    setFlashcardSet(demoFlashcardSet);
    setStudyStats({ 
      correct: 0, 
      incorrect: 0, 
      remaining: demoFlashcardSet.cards.length 
    });
    setMode('study');
    setCurrentCardIndex(0);
    setCurrentSide('front');
    setStudiedCards(new Set());
    toast.success('Loaded demo flashcard set!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet?.cards[currentCardIndex];
  const progress = flashcardSet ? ((currentCardIndex + 1) / flashcardSet.cards.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Brain className="h-8 w-8 mr-3 text-primary" />
                AI Flashcards
              </h1>
              <p className="text-muted-foreground mt-1">
                Generate and study custom flashcards on any cybersecurity topic
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/student/dashboard')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Mode: Create */}
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-cyber-green" />
                  Generate Flashcards
                </CardTitle>
                <CardDescription>
                  Enter a cybersecurity topic and let AI create personalized flashcards for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">What do you want to learn?</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., 'password security', 'network protocols', 'malware analysis'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDifficulty(level)}
                        className={difficulty === level ? 'bg-primary' : ''}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={generateFlashcards}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Flashcards
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={loadDemoSet}
                    className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo Set
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Topics */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'Password Security', 'Phishing Attacks', 'Network Security',
                    'Malware Analysis', 'Encryption', 'Firewalls',
                    'Social Engineering', 'Risk Assessment'
                  ].map((exampleTopic) => (
                    <Button
                      key={exampleTopic}
                      variant="ghost"
                      size="sm"
                      onClick={() => setTopic(exampleTopic)}
                      className="justify-start text-left hover:bg-primary/10"
                    >
                      {exampleTopic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mode: Study */}
        {mode === 'study' && flashcardSet && currentCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Progress Header */}
            <Card className="cyber-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-foreground">{flashcardSet.title}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      {currentCardIndex + 1} of {flashcardSet.cards.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shuffleCards}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Study Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="cyber-card">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-cyber-green">{studyStats.correct}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </CardContent>
              </Card>
              <Card className="cyber-card">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{studyStats.incorrect}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </CardContent>
              </Card>
              <Card className="cyber-card">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-cyber-blue">{studyStats.remaining}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </CardContent>
              </Card>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
              <motion.div
                className="w-full max-w-2xl h-80 cursor-pointer"
                onClick={flipCard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSide}
                    initial={{ rotateY: isFlipping ? 90 : 0, opacity: isFlipping ? 0 : 1 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <Card className="w-full h-full cyber-card bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="h-full flex flex-col justify-center items-center p-8 text-center">
                        <div className="mb-4">
                          <Badge variant={currentSide === 'front' ? 'default' : 'secondary'}>
                            {currentSide === 'front' ? 'Question' : 'Answer'}
                          </Badge>
                        </div>
                        <div className="text-xl font-medium text-foreground leading-relaxed">
                          {currentSide === 'front' ? currentCard.front : currentCard.back}
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                          {currentSide === 'front' ? 'Click to reveal answer' : 'Click to see question'}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Study Controls */}
            {currentSide === 'back' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center space-x-4"
              >
                <Button
                  onClick={() => markCard(false)}
                  variant="outline"
                  size="lg"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <X className="h-5 w-5 mr-2" />
                  Need More Practice
                </Button>
                <Button
                  onClick={() => markCard(true)}
                  size="lg"
                  className="bg-cyber-green hover:bg-cyber-green/90 text-black"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Got It Right!
                </Button>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => setMode('create')}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Create
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (currentCardIndex > 0) {
                      setCurrentCardIndex(currentCardIndex - 1);
                      setCurrentSide('front');
                    }
                  }}
                  disabled={currentCardIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (currentCardIndex < flashcardSet.cards.length - 1) {
                      setCurrentCardIndex(currentCardIndex + 1);
                      setCurrentSide('front');
                    }
                  }}
                  disabled={currentCardIndex === flashcardSet.cards.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mode: Review */}
        {mode === 'review' && flashcardSet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="cyber-card text-center">
              <CardContent className="py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Great job! Study session complete.
                </h2>
                
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                  <div>
                    <div className="text-2xl font-bold text-cyber-green">{studyStats.correct}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">{studyStats.incorrect}</div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{Math.round((studyStats.correct / (studyStats.correct + studyStats.incorrect)) * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      setCurrentCardIndex(0);
                      setCurrentSide('front');
                      setStudyStats({ 
                        correct: 0, 
                        incorrect: 0, 
                        remaining: flashcardSet.cards.length 
                      });
                      setStudiedCards(new Set());
                      setMode('study');
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Study Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMode('create')}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Create New Set
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Sparkles, Clock, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, RotateCw, Trophy,
  Brain, Play, Pause, RefreshCw, Award, Zap,
  BookOpen, AlertCircle, TrendingUp, Users
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
import { toast } from 'react-hot-toast';

type QuizMode = 'create' | 'taking' | 'results';
type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

interface QuizAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
  timeSpent: number;
}

export default function QuizPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [mode, setMode] = useState<QuizMode>('create');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
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

  // Timer effect
  useEffect(() => {
    if (mode === 'taking' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - auto submit
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeLeft]);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for your quiz');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));

    const questionTypes: QuestionType[] = ['multiple-choice', 'true-false', 'fill-blank'];
    
    const generateQuestion = (index: number): Question => {
      const questionType = questionTypes[index % questionTypes.length];
      const basePoints = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;

      const questionTemplates = {
        'multiple-choice': {
          question: `Which of the following best describes ${topic}?`,
          options: [
            `${topic} is a security measure that protects against unauthorized access`,
            `${topic} is primarily used for data encryption and decryption`,
            `${topic} is a network protocol for secure communication`,
            `${topic} is a type of malware detection system`
          ],
          correct: `${topic} is a security measure that protects against unauthorized access`,
          explanation: `This is the most accurate description of ${topic} in the context of cybersecurity.`
        },
        'true-false': {
          question: `${topic} is considered a fundamental component of cybersecurity defense.`,
          correct: 'true',
          explanation: `Yes, ${topic} plays a crucial role in maintaining cybersecurity defenses.`
        },
        'fill-blank': {
          question: `The primary purpose of ${topic} is to _____ against security threats.`,
          correct: 'protect',
          explanation: `${topic} is designed to protect systems and data from various security threats.`
        }
      };

      const template = questionTemplates[questionType];
      
      return {
        id: `q${index + 1}`,
        question: template.question,
        type: questionType,
        options: template.options || undefined,
        correct: template.correct,
        explanation: template.explanation,
        points: basePoints
      };
    };

    const questions: Question[] = Array.from({ length: questionCount }, (_, i) => generateQuestion(i));

    const newQuiz: Quiz = {
      id: 'generated-' + Date.now(),
      title: `${topic} Knowledge Check`,
      description: `Test your understanding of ${topic} concepts`,
      questions,
      timeLimit: 600, // 10 minutes
      difficulty,
      topic,
      points: questions.reduce((sum, q) => sum + q.points, 0)
    };

    setQuiz(newQuiz);
    setTimeLeft(newQuiz.timeLimit || 600);
    setIsGenerating(false);
    toast.success(`Generated ${questions.length} questions about ${topic}!`);
  };

  const startQuiz = () => {
    if (!quiz) return;
    setMode('taking');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowExplanation(false);
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
    toast.success('Quiz started! Good luck! 🍀');
  };

  const submitAnswer = () => {
    if (!quiz || !selectedAnswer.trim()) {
      toast.error('Please select an answer');
      return;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer.toLowerCase().trim() === currentQuestion.correct.toLowerCase().trim();
    const timeSpent = Date.now() - questionStartTime;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      correct: isCorrect,
      timeSpent
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowExplanation(true);

    if (isCorrect) {
      toast.success('Correct! Well done! 🎉');
    } else {
      toast.error('Not quite right, but keep learning! 📚');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setMode('results');
    const totalTime = Date.now() - quizStartTime;
    const correctAnswers = answers.filter(a => a.correct).length;
    const score = Math.round((correctAnswers / quiz!.questions.length) * 100);
    
    // Award XP based on performance
    const xpEarned = Math.floor(score * quiz!.points / 100);
    toast.success(`Quiz complete! You earned ${xpEarned} XP!`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz builder...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

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
                <Target className="h-8 w-8 mr-3 text-cyber-green" />
                AI Quiz Builder
              </h1>
              <p className="text-muted-foreground mt-1">
                Generate and take adaptive quizzes on any cybersecurity topic
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
                  Generate Custom Quiz
                </CardTitle>
                <CardDescription>
                  Create a personalized quiz on any cybersecurity topic with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Quiz Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., 'phishing attacks', 'network security', 'encryption'"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <div className="flex gap-2">
                      {[5, 10, 15, 20].map((count) => (
                        <Button
                          key={count}
                          variant={questionCount === count ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setQuestionCount(count)}
                          className={questionCount === count ? 'bg-cyber-green text-black' : ''}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? 'default' : 'outline'}
                        onClick={() => setDifficulty(level)}
                        className={difficulty === level ? 'bg-primary' : ''}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                        <span className="ml-2 text-xs">
                          {level === 'easy' ? '5 pts' : level === 'medium' ? '10 pts' : '15 pts'}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateQuiz}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Generate Quiz ({questionCount} questions)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Quiz Preview */}
            {quiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cyber-card border-cyber-green/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-cyber-green" />
                      {quiz.title}
                    </CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyber-green">{quiz.questions.length}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyber-blue">{formatTime(quiz.timeLimit || 600)}</div>
                        <div className="text-sm text-muted-foreground">Time Limit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyber-purple">{quiz.points}</div>
                        <div className="text-sm text-muted-foreground">Total Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{difficulty}</div>
                        <div className="text-sm text-muted-foreground">Difficulty</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={startQuiz}
                        className="flex-1 bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Quiz
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuiz(null);
                          setTopic('');
                        }}
                        className="border-muted text-muted-foreground"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate New
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Start Options */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'Password Security', 'Phishing Attacks', 'Malware Types',
                    'Network Protocols', 'Encryption Basics', 'Social Engineering',
                    'Firewalls', 'Risk Assessment', 'Incident Response',
                    'Data Privacy', 'Mobile Security', 'Cloud Security'
                  ].map((quickTopic) => (
                    <Button
                      key={quickTopic}
                      variant="ghost"
                      size="sm"
                      onClick={() => setTopic(quickTopic)}
                      className="justify-start text-left hover:bg-primary/10"
                    >
                      {quickTopic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mode: Taking Quiz */}
        {mode === 'taking' && quiz && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Quiz Header */}
            <Card className="cyber-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-foreground">{quiz.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-destructive' : 'text-cyber-blue'}`}>
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-xs text-muted-foreground">Time Left</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyber-green">{currentQuestion.points}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="cyber-card border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <Badge variant="secondary" className="mb-4">
                      {currentQuestion.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <h3 className="text-xl font-medium text-foreground leading-relaxed">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Multiple Choice */}
                  {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAnswer(option)}
                          disabled={showExplanation}
                          className={`w-full p-4 text-left rounded-lg border transition-all ${
                            selectedAnswer === option
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50 text-foreground'
                          } ${showExplanation ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedAnswer === option ? 'border-primary bg-primary' : 'border-muted'
                            }`} />
                            <span>{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {currentQuestion.type === 'true-false' && (
                    <div className="flex gap-4">
                      {['True', 'False'].map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedAnswer(option.toLowerCase())}
                          disabled={showExplanation}
                          className={`flex-1 p-6 rounded-lg border transition-all ${
                            selectedAnswer === option.toLowerCase()
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50 text-foreground'
                          } ${showExplanation ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">
                              {option === 'True' ? '✓' : '✗'}
                            </div>
                            <div className="font-medium">{option}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Fill in the Blank */}
                  {currentQuestion.type === 'fill-blank' && (
                    <div className="space-y-4">
                      <Input
                        placeholder="Type your answer here..."
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={showExplanation}
                        className="text-lg p-4"
                      />
                    </div>
                  )}

                  {/* Explanation */}
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        answers[answers.length - 1]?.correct
                          ? 'border-cyber-green bg-cyber-green/10'
                          : 'border-destructive bg-destructive/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {answers[answers.length - 1]?.correct ? (
                          <CheckCircle className="h-5 w-5 text-cyber-green mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium mb-2">
                            {answers[answers.length - 1]?.correct ? 'Correct!' : 'Incorrect'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {currentQuestion.explanation}
                          </p>
                          {!answers[answers.length - 1]?.correct && (
                            <p className="text-sm font-medium mt-2">
                              Correct answer: {currentQuestion.correct}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => setMode('create')}
                disabled={showExplanation}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Quiz
              </Button>

              <div className="space-x-2">
                {!showExplanation ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-cyber-green hover:bg-cyber-green/90 text-black"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                      <>
                        Next Question
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Quiz
                        <Trophy className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mode: Results */}
        {mode === 'results' && quiz && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <Card className="cyber-card text-center border-cyber-green/30">
              <CardContent className="py-12">
                <div className="text-6xl mb-4">
                  {(answers.filter(a => a.correct).length / quiz.questions.length) >= 0.8 ? '🎉' : 
                   (answers.filter(a => a.correct).length / quiz.questions.length) >= 0.6 ? '👏' : '📚'}
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Quiz Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  {quiz.title} - {quiz.questions.length} questions
                </p>

                {/* Score Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
                  <div>
                    <div className="text-3xl font-bold text-cyber-green">
                      {answers.filter(a => a.correct).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-destructive">
                      {answers.filter(a => !a.correct).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {Math.round((answers.filter(a => a.correct).length / quiz.questions.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyber-blue">
                      {Math.floor((answers.filter(a => a.correct).length / quiz.questions.length) * quiz.points)}
                    </div>
                    <div className="text-sm text-muted-foreground">XP Earned</div>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="mb-6">
                  {(answers.filter(a => a.correct).length / quiz.questions.length) >= 0.9 ? (
                    <Badge className="bg-cyber-green text-black text-lg py-2 px-4">
                      <Award className="h-4 w-4 mr-2" />
                      Excellent Performance!
                    </Badge>
                  ) : (answers.filter(a => a.correct).length / quiz.questions.length) >= 0.7 ? (
                    <Badge className="bg-primary text-primary-foreground text-lg py-2 px-4">
                      <Trophy className="h-4 w-4 mr-2" />
                      Good Job!
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-lg py-2 px-4">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Keep Learning!
                    </Badge>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      setMode('create');
                      setQuiz(null);
                      setAnswers([]);
                      setTopic('');
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Take Another Quiz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/student/progress')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
                <CardDescription>
                  Review your answers and learn from mistakes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => {
                    const answer = answers[index];
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border ${
                          answer?.correct ? 'border-cyber-green bg-cyber-green/5' : 'border-destructive bg-destructive/5'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              Q{index + 1}: {question.question}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            {answer?.correct ? (
                              <CheckCircle className="h-5 w-5 text-cyber-green" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                            <span className="text-sm font-medium">
                              {answer?.correct ? `+${question.points}` : '0'} pts
                            </span>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-muted-foreground">Your answer: </span>
                            <span className={answer?.correct ? 'text-cyber-green' : 'text-destructive'}>
                              {answer?.answer}
                            </span>
                          </div>
                          {!answer?.correct && (
                            <div>
                              <span className="text-muted-foreground">Correct answer: </span>
                              <span className="text-cyber-green">{question.correct}</span>
                            </div>
                          )}
                          <div className="text-muted-foreground text-xs pt-2">
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
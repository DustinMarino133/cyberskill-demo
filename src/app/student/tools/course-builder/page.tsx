'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, Sparkles, Clock, Target, ChevronLeft,
  Play, CheckCircle, Plus, Trash2, Edit, Save,
  Brain, Zap, Award, Users, Calendar, Monitor
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { toast } from 'react-hot-toast';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'hands-on';
  duration: number;
  content?: string;
}

interface CustomCourse {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  modules: CourseModule[];
  createdAt: string;
  category: string;
}

export default function CourseBuilderPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<CustomCourse | null>(null);
  const [savedCourses, setSavedCourses] = useState<CustomCourse[]>([]);
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'intermediate' as const,
    duration: '4',
    focus: 'practical' as const,
    includeQuizzes: true,
    includeHandsOn: true
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadSavedCourses();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const loadSavedCourses = () => {
    const saved = localStorage.getItem('customCourses');
    if (saved) {
      setSavedCourses(JSON.parse(saved));
    }
  };

  const generateCourse = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a course topic');
      return;
    }

    setIsGenerating(true);

    // Simulate AI course generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const modules: CourseModule[] = [
      {
        id: 'm1',
        title: `Introduction to ${formData.topic}`,
        description: `Fundamentals and core concepts of ${formData.topic}`,
        estimatedTime: 60,
        lessons: [
          { id: 'l1', title: 'Overview and History', type: 'video', duration: 15 },
          { id: 'l2', title: 'Key Concepts', type: 'reading', duration: 20 },
          { id: 'l3', title: 'Knowledge Check', type: 'quiz', duration: 10 },
          { id: 'l4', title: 'Basic Exercise', type: 'hands-on', duration: 15 }
        ]
      },
      {
        id: 'm2',
        title: `Core Principles of ${formData.topic}`,
        description: `Deep dive into the essential principles and methodologies`,
        estimatedTime: 90,
        lessons: [
          { id: 'l5', title: 'Theoretical Foundation', type: 'video', duration: 25 },
          { id: 'l6', title: 'Case Studies', type: 'reading', duration: 30 },
          { id: 'l7', title: 'Practical Application', type: 'hands-on', duration: 25 },
          { id: 'l8', title: 'Assessment', type: 'quiz', duration: 10 }
        ]
      },
      {
        id: 'm3',
        title: `Advanced ${formData.topic} Techniques`,
        description: `Advanced concepts and real-world applications`,
        estimatedTime: 120,
        lessons: [
          { id: 'l9', title: 'Advanced Concepts', type: 'video', duration: 30 },
          { id: 'l10', title: 'Industry Best Practices', type: 'reading', duration: 35 },
          { id: 'l11', title: 'Complex Scenarios', type: 'hands-on', duration: 40 },
          { id: 'l12', title: 'Final Assessment', type: 'quiz', duration: 15 }
        ]
      }
    ];

    const course: CustomCourse = {
      id: `custom-${Date.now()}`,
      title: `Mastering ${formData.topic}`,
      description: `A comprehensive ${formData.difficulty}-level course covering all aspects of ${formData.topic} in cybersecurity`,
      difficulty: formData.difficulty,
      estimatedHours: parseInt(formData.duration),
      modules,
      createdAt: new Date().toISOString(),
      category: 'Custom Generated'
    };

    setGeneratedCourse(course);
    setIsGenerating(false);
    toast.success(`Course "${course.title}" generated successfully! 🎉`);
  };

  const saveCourse = () => {
    if (!generatedCourse) return;

    const updated = [...savedCourses, generatedCourse];
    setSavedCourses(updated);
    localStorage.setItem('customCourses', JSON.stringify(updated));
    toast.success('Course saved to your library! 📚');
  };

  const deleteCourse = (courseId: string) => {
    const updated = savedCourses.filter(c => c.id !== courseId);
    setSavedCourses(updated);
    localStorage.setItem('customCourses', JSON.stringify(updated));
    toast.success('Course deleted from library');
  };

  const startCourse = (course: CustomCourse) => {
    toast.success(`Starting "${course.title}"! Let's learn! 🚀`);
    // In a real app, this would navigate to the course content
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Monitor;
      case 'reading': return BookOpen;
      case 'quiz': return Target;
      case 'hands-on': return Brain;
      default: return BookOpen;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-cyber-green" />
                AI Course Builder
              </h1>
              <p className="text-muted-foreground mt-1">
                Create personalized cybersecurity learning paths with AI
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-cyber-green" />
                  Generate Custom Course
                </CardTitle>
                <CardDescription>
                  Tell us what you want to learn and we'll create a personalized course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Course Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., 'Penetration Testing', 'Cloud Security', 'Digital Forensics'"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <div className="flex gap-2">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                        <Button
                          key={level}
                          variant={formData.difficulty === level ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, difficulty: level })}
                          size="sm"
                          className={formData.difficulty === level ? 'bg-primary' : ''}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Course Duration</Label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground"
                    >
                      <option value="2">2 weeks (8-10 hours)</option>
                      <option value="4">4 weeks (15-20 hours)</option>
                      <option value="6">6 weeks (25-30 hours)</option>
                      <option value="8">8 weeks (35-40 hours)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Learning Focus</Label>
                  <div className="flex gap-2">
                    {(['theoretical', 'practical', 'balanced'] as const).map((focus) => (
                      <Button
                        key={focus}
                        variant={formData.focus === focus ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, focus })}
                        size="sm"
                        className={formData.focus === focus ? 'bg-cyber-green text-black' : ''}
                      >
                        {focus.charAt(0).toUpperCase() + focus.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Include Content Types</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.includeQuizzes}
                        onChange={(e) => setFormData({ ...formData, includeQuizzes: e.target.checked })}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Interactive Quizzes & Assessments</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.includeHandsOn}
                        onChange={(e) => setFormData({ ...formData, includeHandsOn: e.target.checked })}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Hands-on Labs & Exercises</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={generateCourse}
                  disabled={isGenerating || !formData.topic.trim()}
                  className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                      Generating Course...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Generate Course
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Course Preview */}
            {generatedCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cyber-card border-2 border-cyber-green/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Award className="h-5 w-5 mr-2 text-cyber-green" />
                          {generatedCourse.title}
                        </CardTitle>
                        <CardDescription>{generatedCourse.description}</CardDescription>
                      </div>
                      <Badge className="bg-cyber-green text-black">Generated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-cyber-green">{generatedCourse.modules.length}</div>
                        <div className="text-sm text-muted-foreground">Modules</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyber-blue">{generatedCourse.estimatedHours}h</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyber-purple">
                          {generatedCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Lessons</div>
                      </div>
                    </div>

                    {/* Course Modules */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Course Content</h4>
                      {generatedCourse.modules.map((module, index) => (
                        <div key={module.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">Module {index + 1}: {module.title}</h5>
                            <Badge variant="outline">{module.estimatedTime}min</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="space-y-2">
                            {module.lessons.map((lesson) => {
                              const Icon = getLessonIcon(lesson.type);
                              return (
                                <div key={lesson.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{lesson.title}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {lesson.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{lesson.duration}min</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => startCourse(generatedCourse)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </Button>
                      <Button
                        onClick={saveCourse}
                        variant="outline"
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Saved Courses Sidebar */}
          <div className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Custom Courses</CardTitle>
                <CardDescription>
                  {savedCourses.length} saved courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedCourses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No custom courses yet</p>
                    <p className="text-sm">Generate your first course!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedCourses.map((course) => (
                      <div key={course.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-2">{course.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCourse(course.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          {course.difficulty} • {course.estimatedHours}h • {course.modules.length} modules
                        </div>
                        <Button
                          size="sm"
                          onClick={() => startCourse(course)}
                          className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    'Ethical Hacking Basics',
                    'CISSP Exam Prep',
                    'Incident Response',
                    'Cloud Security AWS',
                    'Digital Forensics'
                  ].map((template) => (
                    <Button
                      key={template}
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, topic: template })}
                      className="w-full justify-start text-left"
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
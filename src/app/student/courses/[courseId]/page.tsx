'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, CheckCircle, Clock, Users, Star,
  Award, BookOpen, Target, Download, Heart,
  PlayCircle, Lock, Trophy, Shield, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { toast } from 'react-hot-toast';

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
  completed: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading' | 'lab';
  completed: boolean;
  locked: boolean;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  modules: CourseModule[];
  skills: string[];
  thumbnail: string;
  progress: number;
}

export default function CourseDetailPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadCourseData();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router, courseId]);

  const loadCourseData = () => {
    const courses: { [key: string]: CourseData } = {
      'cyber-101': {
        id: 'cyber-101',
        title: 'Cybersecurity Fundamentals',
        description: 'Master essential cybersecurity concepts, from threat identification to implementing security best practices.',
        instructor: 'Dr. Sarah Chen',
        rating: 4.8,
        students: 1245,
        duration: '4 weeks',
        thumbnail: '🛡️',
        progress: 25,
        skills: ['Password Security', 'Safe Browsing', 'Email Security', 'Digital Citizenship'],
        modules: [
          {
            id: 'm1',
            title: 'Introduction to Cybersecurity',
            duration: '45 min',
            completed: true,
            lessons: [
              { id: 'l1', title: 'What is Cybersecurity?', duration: '8 min', type: 'video', completed: true, locked: false },
              { id: 'l2', title: 'Common Threat Landscape', duration: '12 min', type: 'video', completed: true, locked: false },
              { id: 'l3', title: 'Basic Security Principles', duration: '10 min', type: 'reading', completed: true, locked: false },
              { id: 'l4', title: 'Knowledge Check', duration: '5 min', type: 'quiz', completed: false, locked: false },
              { id: 'l5', title: 'Security Assessment Lab', duration: '10 min', type: 'lab', completed: false, locked: false }
            ]
          },
          {
            id: 'm2',
            title: 'Password Security',
            duration: '60 min',
            completed: false,
            lessons: [
              { id: 'l6', title: 'Password Best Practices', duration: '15 min', type: 'video', completed: false, locked: false },
              { id: 'l7', title: 'Two-Factor Authentication', duration: '12 min', type: 'video', completed: false, locked: true }
            ]
          }
        ]
      }
    };

    const courseData = courses[courseId] || courses['cyber-101'];
    setCourse(courseData);
    const firstLesson = courseData.modules[0]?.lessons[0];
    if (firstLesson) {
      setCurrentLesson(firstLesson);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (!lesson.locked) {
      setCurrentLesson(lesson);
      setIsPlaying(false);
    } else {
      toast.error('Complete previous lessons to unlock this one!');
    }
  };

  const markLessonComplete = () => {
    if (currentLesson && course) {
      const updatedCourse = { ...course };
      const lesson = updatedCourse.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === currentLesson.id);
      
      if (lesson) {
        lesson.completed = true;
        setCourse(updatedCourse);
        toast.success('Lesson completed! 🎉');
      }
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'quiz': return Target;
      case 'reading': return BookOpen;
      case 'lab': return Shield;
      default: return PlayCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'quiz': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'reading': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'lab': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  if (!user || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-slate-400 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      
      <Navbar user={user} />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/student/courses')}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="text-4xl">{course.thumbnail}</div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{course.title}</h1>
              <p className="text-slate-400">with {course.instructor}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-white font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()} students</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span>{course.progress}% complete</span>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={course.progress} className="h-3" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-video bg-slate-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  {!isPlaying ? (
                    <Button
                      onClick={() => setIsPlaying(true)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full h-20 w-20"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎥</div>
                        <p className="text-white text-lg">Video Player Simulation</p>
                        <p className="text-slate-400 text-sm">Playing: {currentLesson?.title}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {currentLesson?.title || 'Select a lesson'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <Badge className={getTypeColor(currentLesson?.type || 'video')}>
                        {currentLesson?.type}
                      </Badge>
                      <span>{currentLesson?.duration}</span>
                    </div>
                  </div>
                  {currentLesson && !currentLesson.completed && (
                    <Button
                      onClick={markLessonComplete}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Previous
                  </Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">About this course</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{course.description}</p>
              
              <h4 className="text-lg font-bold text-white mb-3">Skills you'll learn</h4>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-slate-800/50 text-slate-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-fit sticky top-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Course Content</h3>
              
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <h4 className="font-bold text-white text-sm">{module.title}</h4>
                        <p className="text-xs text-slate-400">{module.duration}</p>
                      </div>
                      {module.completed && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>

                    <div className="ml-4 space-y-1">
                      {module.lessons.map((lesson) => {
                        const LessonIcon = getLessonIcon(lesson.type);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            disabled={lesson.locked}
                            className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-all ${
                              currentLesson?.id === lesson.id
                                ? 'bg-cyan-500/20 border border-cyan-500/30'
                                : lesson.locked
                                ? 'text-slate-500 cursor-not-allowed'
                                : 'text-slate-300 hover:bg-slate-800/50'
                            }`}
                          >
                            {lesson.locked ? (
                              <Lock className="h-4 w-4 text-slate-500" />
                            ) : lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <LessonIcon className="h-4 w-4" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{lesson.title}</p>
                              <p className="text-xs text-slate-500">{lesson.duration}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resources
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
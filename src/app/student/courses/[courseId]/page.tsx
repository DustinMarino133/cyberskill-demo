'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, CheckCircle, Clock, Users, Star, 
  ChevronLeft, ChevronRight, BookOpen, Award,
  Lock, Eye, Download, Share, Menu, X,
  PlayCircle, Pause, Volume2, Settings,
  RotateCcw, FastForward
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface CourseVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  completed: boolean;
  locked: boolean;
  watchTime: number; // in seconds
  totalTime: number; // in seconds
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  videos: CourseVideo[];
  completed: boolean;
  totalDuration: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  totalDuration: string;
  modules: CourseModule[];
  certificate: boolean;
  skills: string[];
}

export default function CourseViewPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentVideo, setCurrentVideo] = useState<CourseVideo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const { currentTheme } = useTheme();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadCourse();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router, params]);

  const loadCourse = () => {
    // Mock course data with YouTube-style video structure
    const mockCourse: CourseData = {
      id: params.courseId as string,
      title: 'Introduction to Cybersecurity',
      description: 'Master the fundamentals of cybersecurity with hands-on lessons and real-world examples.',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      students: 1247,
      totalDuration: '8h 45m',
      certificate: true,
      skills: ['Threat Recognition', 'Network Security', 'Risk Assessment', 'Incident Response'],
      modules: [
        {
          id: 'module-1',
          title: 'Getting Started with Cybersecurity',
          description: 'Learn the basics of cybersecurity and why it matters in today\'s digital world.',
          totalDuration: '2h 15m',
          completed: false,
          videos: [
            {
              id: 'video-1',
              title: 'Welcome to Cybersecurity',
              description: 'An introduction to the course and what you\'ll learn about protecting digital assets.',
              duration: '8:42',
              thumbnail: 'https://img.youtube.com/vi/inWWhr5tnEA/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
              completed: true,
              locked: false,
              watchTime: 522,
              totalTime: 522
            },
            {
              id: 'video-2',
              title: 'What is Cybersecurity?',
              description: 'Understand the definition, scope, and importance of cybersecurity in protecting information systems.',
              duration: '12:18',
              thumbnail: 'https://img.youtube.com/vi/z5rRZdiu1UE/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/z5rRZdiu1UE',
              completed: true,
              locked: false,
              watchTime: 738,
              totalTime: 738
            },
            {
              id: 'video-3',
              title: 'Types of Cyber Threats',
              description: 'Explore different categories of cyber threats including malware, phishing, and social engineering.',
              duration: '15:30',
              thumbnail: 'https://img.youtube.com/vi/Dk-ZqQ-bfy4/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/Dk-ZqQ-bfy4',
              completed: false,
              locked: false,
              watchTime: 245,
              totalTime: 930
            },
            {
              id: 'video-4',
              title: 'Cybersecurity Frameworks',
              description: 'Learn about industry-standard frameworks like NIST and ISO 27001 for managing cybersecurity.',
              duration: '18:45',
              thumbnail: 'https://img.youtube.com/vi/9OGWaVCm1p0/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/9OGWaVCm1p0',
              completed: false,
              locked: false,
              watchTime: 0,
              totalTime: 1125
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Network Security Fundamentals',
          description: 'Deep dive into securing networks and understanding common attack vectors.',
          totalDuration: '3h 20m',
          completed: false,
          videos: [
            {
              id: 'video-5',
              title: 'Network Basics for Security',
              description: 'Understanding network protocols, topology, and how data flows through networks.',
              duration: '22:15',
              thumbnail: 'https://img.youtube.com/vi/3QhU9jd03a0/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/3QhU9jd03a0',
              completed: false,
              locked: true,
              watchTime: 0,
              totalTime: 1335
            },
            {
              id: 'video-6',
              title: 'Firewalls and Network Defense',
              description: 'Learn how firewalls work and how to configure them for maximum security.',
              duration: '19:30',
              thumbnail: 'https://img.youtube.com/vi/kDEX1HXybrU/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/kDEX1HXybrU',
              completed: false,
              locked: true,
              watchTime: 0,
              totalTime: 1170
            },
            {
              id: 'video-7',
              title: 'Intrusion Detection Systems',
              description: 'Understanding IDS/IPS systems and how they help detect and prevent attacks.',
              duration: '25:10',
              thumbnail: 'https://img.youtube.com/vi/72_a6YrqQAs/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/72_a6YrqQAs',
              completed: false,
              locked: true,
              watchTime: 0,
              totalTime: 1510
            }
          ]
        },
        {
          id: 'module-3',
          title: 'Cryptography and Data Protection',
          description: 'Master the art of protecting data through encryption and secure communication.',
          totalDuration: '3h 10m',
          completed: false,
          videos: [
            {
              id: 'video-8',
              title: 'Introduction to Cryptography',
              description: 'Learn the basics of encryption, decryption, and how cryptography protects data.',
              duration: '20:45',
              thumbnail: 'https://img.youtube.com/vi/jhXCTbFnK8o/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/jhXCTbFnK8o',
              completed: false,
              locked: true,
              watchTime: 0,
              totalTime: 1245
            },
            {
              id: 'video-9',
              title: 'Symmetric vs Asymmetric Encryption',
              description: 'Understand the differences between symmetric and asymmetric encryption methods.',
              duration: '17:25',
              thumbnail: 'https://img.youtube.com/vi/AQDCe585Lnc/maxresdefault.jpg',
              videoUrl: 'https://www.youtube.com/embed/AQDCe585Lnc',
              completed: false,
              locked: true,
              watchTime: 0,
              totalTime: 1045
            }
          ]
        }
      ]
    };

    setCourse(mockCourse);
    
    // Set the first available video as current
    const firstModule = mockCourse.modules[0];
    const firstVideo = firstModule.videos[0];
    setCurrentVideo(firstVideo);
  };

  const handleVideoSelect = (video: CourseVideo) => {
    if (video.locked) {
      toast.error('Complete previous videos to unlock this content');
      return;
    }
    setCurrentVideo(video);
    setIsPlaying(false);
    setCurrentTime(video.watchTime);
  };

  const markVideoComplete = (videoId: string) => {
    if (!course) return;
    
    const updatedCourse = { ...course };
    updatedCourse.modules.forEach(module => {
      module.videos.forEach(video => {
        if (video.id === videoId) {
          video.completed = true;
          video.watchTime = video.totalTime;
          
          // Unlock next video
          const videoIndex = module.videos.indexOf(video);
          if (videoIndex < module.videos.length - 1) {
            module.videos[videoIndex + 1].locked = false;
          }
        }
      });
    });
    
    setCourse(updatedCourse);
    toast.success('Video completed! 🎉');
  };

  const getProgressPercentage = () => {
    if (!course) return 0;
    
    const totalVideos = course.modules.reduce((sum, module) => sum + module.videos.length, 0);
    const completedVideos = course.modules.reduce((sum, module) => 
      sum + module.videos.filter(video => video.completed).length, 0);
    
    return Math.round((completedVideos / totalVideos) * 100);
  };

  const getModuleProgress = (module: CourseModule) => {
    const completed = module.videos.filter(video => video.completed).length;
    const total = module.videos.length;
    return Math.round((completed / total) * 100);
  };

  if (!user || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.colors.background }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: currentTheme.colors.primary }}></div>
          <p style={{ color: currentTheme.colors.textSecondary }}>Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <Navbar user={user} />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Course Content Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              className="w-96 border-r overflow-y-auto"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/student/courses')}
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Courses
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSidebarOpen(false)}
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Course Header */}
                <div className="mb-6">
                  <h1 className="text-xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                    {course.title}
                  </h1>
                  <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                    {course.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm mb-4">
                    <div className="flex items-center" style={{ color: currentTheme.colors.textSecondary }}>
                      <Clock className="h-4 w-4 mr-1" />
                      {course.totalDuration}
                    </div>
                    <div className="flex items-center" style={{ color: currentTheme.colors.textSecondary }}>
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                    <div className="flex items-center" style={{ color: currentTheme.colors.accent }}>
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      {course.rating}
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: currentTheme.colors.text }}>Course Progress</span>
                      <span style={{ color: currentTheme.colors.text }}>{getProgressPercentage()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${getProgressPercentage()}%`,
                          backgroundColor: currentTheme.colors.primary
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Course Modules */}
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                          {moduleIndex + 1}. {module.title}
                        </h3>
                        <Badge style={{ backgroundColor: `${currentTheme.colors.primary}20`, color: currentTheme.colors.primary }}>
                          {getModuleProgress(module)}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {module.videos.map((video, videoIndex) => (
                          <motion.div
                            key={video.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleVideoSelect(video)}
                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                              currentVideo?.id === video.id ? 'ring-2 ring-primary' : ''
                            }`}
                            style={{ 
                              backgroundColor: currentVideo?.id === video.id 
                                ? `${currentTheme.colors.primary}20` 
                                : `${currentTheme.colors.surface}50`
                            }}
                          >
                            <div className="relative">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-20 h-12 object-cover rounded"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                {video.locked ? (
                                  <Lock className="h-4 w-4 text-white bg-black/50 rounded-full p-1" />
                                ) : video.completed ? (
                                  <CheckCircle className="h-5 w-5" style={{ color: currentTheme.colors.success }} />
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-white" />
                                )}
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                {video.duration}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate" style={{ color: currentTheme.colors.text }}>
                                {videoIndex + 1}. {video.title}
                              </h4>
                              <p className="text-xs line-clamp-2" style={{ color: currentTheme.colors.textSecondary }}>
                                {video.description}
                              </p>
                              
                              {!video.completed && video.watchTime > 0 && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div 
                                      className="h-1 rounded-full"
                                      style={{ 
                                        width: `${(video.watchTime / video.totalTime) * 100}%`,
                                        backgroundColor: currentTheme.colors.accent
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
            {currentVideo && (
              <iframe
                src={currentVideo.videoUrl}
                title={currentVideo.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
            
            {/* Sidebar Toggle Button */}
            {!sidebarOpen && (
              <Button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-4 left-4 z-10"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text
                }}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Video Info and Controls */}
          <div className="flex-1 p-6">
            {currentVideo && (
              <div className="max-w-4xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                      {currentVideo.title}
                    </h2>
                    <p className="mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                      {currentVideo.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center" style={{ color: currentTheme.colors.textSecondary }}>
                        <Clock className="h-4 w-4 mr-1" />
                        {currentVideo.duration}
                      </div>
                      <div className="flex items-center" style={{ color: currentTheme.colors.textSecondary }}>
                        <Eye className="h-4 w-4 mr-1" />
                        {course.students} students
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!currentVideo.completed && (
                      <Button
                        onClick={() => markVideoComplete(currentVideo.id)}
                        style={{ 
                          backgroundColor: currentTheme.colors.success,
                          color: currentTheme.colors.background
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      style={{ 
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text
                      }}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Course Skills */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                    Skills You&apos;ll Learn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline"
                        style={{ 
                          borderColor: currentTheme.colors.border,
                          color: currentTheme.colors.text
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Instructor Info */}
                <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
                      >
                        <Users className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                          {course.instructor}
                        </h4>
                        <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          Cybersecurity Expert & Instructor
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
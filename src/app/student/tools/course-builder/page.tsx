'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Save, Eye, Trash2, Edit3, 
  BookOpen, Play, Clock, Users, Star, Award,
  Settings, Upload, Video, FileText, HelpCircle,
  ChevronRight, ChevronLeft, Copy, Download,
  Layers, Target, Zap, CheckCircle, Image,
  Monitor, Smartphone, Globe, Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile, Course, Lesson } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface CourseBuilderLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  content: string;
  duration: number;
  order: number;
}

interface CourseProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: CourseBuilderLesson[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  lastModified: Date;
  estimatedDuration: number;
}

type BuilderMode = 'library' | 'create' | 'edit' | 'preview';
type LessonType = 'video' | 'text' | 'quiz' | 'interactive';

const LESSON_TEMPLATES = [
  { type: 'text' as LessonType, name: 'Text Lesson', icon: FileText, description: 'Written content with formatting' },
  { type: 'video' as LessonType, name: 'Video Lesson', icon: Video, description: 'Video content with player' },
  { type: 'quiz' as LessonType, name: 'Quiz Lesson', icon: HelpCircle, description: 'Interactive quiz questions' },
  { type: 'interactive' as LessonType, name: 'Interactive', icon: Monitor, description: 'Hands-on activities' }
];

const COURSE_CATEGORIES = [
  'Password Security', 'Network Safety', 'Social Engineering', 'Malware Protection',
  'Data Privacy', 'Email Security', 'Web Browsing', 'Mobile Security'
];

export default function CourseBuilderPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [mode, setMode] = useState<BuilderMode>('library');
  const [projects, setProjects] = useState<CourseProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CourseProject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseBuilderLesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const router = useRouter();

  // Demo projects
  const demoProjects = useMemo(() => [
    {
      id: 'demo-1',
      title: 'Intro to Password Security',
      description: 'A comprehensive guide to creating and managing secure passwords',
      thumbnail: '/api/placeholder/300/200',
      difficulty: 'beginner' as const,
      lessons: [
        { id: 'l1', title: 'What Makes a Strong Password?', type: 'text' as const, content: 'Learn the basics...', duration: 10, order: 1 },
        { id: 'l2', title: 'Password Managers Explained', type: 'video' as const, content: 'Video content...', duration: 15, order: 2 },
        { id: 'l3', title: 'Test Your Knowledge', type: 'quiz' as const, content: 'Quiz questions...', duration: 5, order: 3 }
      ],
      tags: ['passwords', 'security', 'beginner'],
      isPublic: true,
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      estimatedDuration: 30
    },
    {
      id: 'demo-2',
      title: 'Email Safety Masterclass',
      description: 'Advanced techniques for identifying and avoiding email threats',
      thumbnail: '/api/placeholder/300/200',
      difficulty: 'intermediate' as const,
      lessons: [
        { id: 'l1', title: 'Spotting Phishing Emails', type: 'interactive' as const, content: 'Interactive examples...', duration: 20, order: 1 },
        { id: 'l2', title: 'Email Header Analysis', type: 'text' as const, content: 'Technical content...', duration: 15, order: 2 }
      ],
      tags: ['email', 'phishing', 'advanced'],
      isPublic: false,
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      estimatedDuration: 35
    }
  ], []);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        // Load saved projects
        const saved = localStorage.getItem('courseProjects');
        if (saved) {
          setProjects([...demoProjects, ...JSON.parse(saved)]);
        } else {
          setProjects(demoProjects);
        }
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router, demoProjects]);

  const createNewProject = () => {
    const newProject: CourseProject = {
      id: `project-${Date.now()}`,
      title: 'Untitled Course',
      description: 'Course description...',
      thumbnail: '/api/placeholder/300/200',
      difficulty: 'beginner',
      lessons: [],
      tags: [],
      isPublic: false,
      createdAt: new Date(),
      lastModified: new Date(),
      estimatedDuration: 0
    };
    setCurrentProject(newProject);
    setMode('edit');
  };

  const editProject = (project: CourseProject) => {
    setCurrentProject(project);
    setMode('edit');
  };

  const saveProject = () => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      lastModified: new Date(),
      estimatedDuration: currentProject.lessons.reduce((total, lesson) => total + lesson.duration, 0)
    };

    const existingIndex = projects.findIndex(p => p.id === currentProject.id);
    let updatedProjects;
    
    if (existingIndex >= 0) {
      updatedProjects = [...projects];
      updatedProjects[existingIndex] = updatedProject;
    } else {
      updatedProjects = [...projects, updatedProject];
    }
    
    setProjects(updatedProjects);
    setCurrentProject(updatedProject);
    
    // Save to localStorage (excluding demo projects)
    const userProjects = updatedProjects.filter(p => !demoProjects.find(demo => demo.id === p.id));
    localStorage.setItem('courseProjects', JSON.stringify(userProjects));
    
    alert('Course saved successfully! 🎉');
  };

  const addLesson = (type: LessonType) => {
    if (!currentProject) return;

    const newLesson: CourseBuilderLesson = {
      id: `lesson-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Lesson`,
      type,
      content: type === 'quiz' ? '{}' : '',
      duration: 10,
      order: currentProject.lessons.length + 1
    };

    setCurrentProject({
      ...currentProject,
      lessons: [...currentProject.lessons, newLesson]
    });
    setSelectedLesson(newLesson);
  };

  const updateLesson = (lessonId: string, updates: Partial<CourseBuilderLesson>) => {
    if (!currentProject) return;

    const updatedLessons = currentProject.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );

    setCurrentProject({
      ...currentProject,
      lessons: updatedLessons
    });

    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson({ ...selectedLesson, ...updates });
    }
  };

  const deleteLesson = (lessonId: string) => {
    if (!currentProject) return;
    
    const updatedLessons = currentProject.lessons.filter(lesson => lesson.id !== lessonId);
    setCurrentProject({
      ...currentProject,
      lessons: updatedLessons
    });
    
    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson(null);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading Course Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => {
                if (mode === 'edit' || mode === 'preview') {
                  setMode('library');
                  setCurrentProject(null);
                  setSelectedLesson(null);
                } else {
                  router.push('/student/tools');
                }
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {mode === 'edit' || mode === 'preview' ? 'Back to Library' : 'Back to Tools'}
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Course Builder</h1>
              <p className="text-slate-400">Create interactive cybersecurity courses and lessons</p>
            </div>
            {mode === 'edit' && currentProject && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode('preview')}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  onClick={saveProject}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Course
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Course Library */}
        {mode === 'library' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Build Amazing Cybersecurity Courses</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Create comprehensive courses with videos, text lessons, quizzes, and interactive content. Share your knowledge with the community!
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center gap-4"
            >
              <Button
                onClick={createNewProject}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Course
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Import Course
              </Button>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                  placeholder="Search your courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-700 text-slate-300">{filteredProjects.length} courses</Badge>
              </div>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                    <CardContent className="p-6">
                      {/* Thumbnail */}
                      <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-blue-400" />
                      </div>

                      {/* Course Info */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                          <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={`${
                            project.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                            project.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {project.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Clock className="h-3 w-3" />
                            {project.estimatedDuration}m
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">{project.lessons.length} lessons</span>
                          <div className="flex gap-1">
                            {project.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => editProject(project)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                            size="sm"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setCurrentProject(project);
                              setMode('preview');
                            }}
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            size="sm"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          size="sm"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Create New Course Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="bg-slate-800/30 border-dashed border-slate-600 hover:border-slate-500 transition-all duration-300 cursor-pointer h-full"
                  onClick={createNewProject}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-300 mb-2">Create New Course</h3>
                    <p className="text-slate-500 text-sm text-center">
                      Start building your own cybersecurity course with lessons, quizzes, and interactive content
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
                  </div>
        )}

        {/* Course Editor */}
        {mode === 'edit' && currentProject && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Course Structure */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Course Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Course Info */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300">Course Title</Label>
                      <Input
                        value={currentProject.title}
                        onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Description</Label>
                      <textarea
                        value={currentProject.description}
                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Difficulty</Label>
                    <select
                        value={currentProject.difficulty}
                        onChange={(e) => setCurrentProject({ ...currentProject, difficulty: e.target.value as any })}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                  {/* Lessons List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">Lessons</h4>
                      <Badge className="bg-slate-700 text-slate-300">{currentProject.lessons.length}</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentProject.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`p-3 rounded cursor-pointer transition-colors ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-blue-500/20 border border-blue-500'
                              : 'bg-slate-700/50 hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{index + 1}</span>
                              {lesson.type === 'video' && <Video className="h-3 w-3 text-slate-400" />}
                              {lesson.type === 'text' && <FileText className="h-3 w-3 text-slate-400" />}
                              {lesson.type === 'quiz' && <HelpCircle className="h-3 w-3 text-slate-400" />}
                              {lesson.type === 'interactive' && <Monitor className="h-3 w-3 text-slate-400" />}
                            </div>
                      <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLesson(lesson.id);
                              }}
                              variant="ghost"
                        size="sm"
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                              <Trash2 className="h-3 w-3" />
                      </Button>
                          </div>
                          <p className="text-sm text-white mt-1 truncate">{lesson.title}</p>
                          <p className="text-xs text-slate-400">{lesson.duration}min</p>
                        </div>
                    ))}
                  </div>
                </div>

                  {/* Add Lesson Buttons */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">Add New Lesson</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {LESSON_TEMPLATES.map((template) => {
                        const Icon = template.icon;
                        return (
                          <Button
                            key={template.type}
                            onClick={() => addLesson(template.type)}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {template.name.split(' ')[0]}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
              </CardContent>
            </Card>
            </div>

            {/* Main Editor Area */}
            <div className="lg:col-span-3">
              {selectedLesson ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Edit Lesson</CardTitle>
                        <CardDescription className="text-slate-400">
                          {LESSON_TEMPLATES.find(t => t.type === selectedLesson.type)?.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500">
                        {selectedLesson.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Lesson Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Lesson Title</Label>
                        <Input
                          value={selectedLesson.title}
                          onChange={(e) => updateLesson(selectedLesson.id, { title: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={selectedLesson.duration}
                          onChange={(e) => updateLesson(selectedLesson.id, { duration: parseInt(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                      <Label className="text-slate-300">Content</Label>
                      {selectedLesson.type === 'text' && (
                        <textarea
                          value={selectedLesson.content}
                          onChange={(e) => updateLesson(selectedLesson.id, { content: e.target.value })}
                          className="w-full h-64 p-3 bg-slate-700 border border-slate-600 rounded text-white"
                          placeholder="Enter your lesson content here. You can use markdown formatting..."
                        />
                      )}
                      
                      {selectedLesson.type === 'video' && (
                    <div className="space-y-4">
                          <Input
                            value={selectedLesson.content}
                            onChange={(e) => updateLesson(selectedLesson.id, { content: e.target.value })}
                            placeholder="Enter video URL or upload video file"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                          <div className="p-8 border-2 border-dashed border-slate-600 rounded-lg text-center">
                            <Video className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-400 mb-2">Drag and drop video file here</p>
                            <Button variant="outline" className="border-slate-600 text-slate-300">
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                                  </div>
                      )}

                      {selectedLesson.type === 'quiz' && (
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-700/50 rounded-lg">
                            <h4 className="text-white font-medium mb-4">Quiz Builder</h4>
                            <p className="text-slate-400 text-sm">
                              Quiz builder interface would go here. Users can add multiple choice questions, 
                              true/false questions, and fill-in-the-blank questions.
                            </p>
                            <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </Button>
                                  </div>
                                </div>
                      )}

                      {selectedLesson.type === 'interactive' && (
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-700/50 rounded-lg">
                            <h4 className="text-white font-medium mb-4">Interactive Content</h4>
                            <p className="text-slate-400 text-sm">
                              Interactive lesson builder would go here. Users can create simulations, 
                              drag-and-drop activities, and other interactive elements.
                            </p>
                            <div className="flex gap-2 mt-4">
                              <Button className="bg-blue-500 hover:bg-blue-600">
                                <Target className="h-4 w-4 mr-2" />
                                Add Simulation
                              </Button>
                              <Button variant="outline" className="border-slate-600 text-slate-300">
                                <Layers className="h-4 w-4 mr-2" />
                                Add Activity
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select a Lesson to Edit</h3>
                    <p className="text-slate-400 mb-6">
                      Choose a lesson from the sidebar to start editing, or create a new lesson to get started.
                    </p>
                    <div className="flex justify-center gap-2">
                      {LESSON_TEMPLATES.map((template) => {
                        const Icon = template.icon;
                        return (
                      <Button
                            key={template.type}
                            onClick={() => addLesson(template.type)}
                        variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                            <Icon className="h-4 w-4 mr-2" />
                            {template.name}
                      </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
            )}
            </div>
          </div>
        )}

        {/* Course Preview */}
        {mode === 'preview' && currentProject && (
          <div className="space-y-6">
            {/* Preview Header */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{currentProject.title}</h2>
                  <div className="flex items-center gap-2">
                          <Button
                      onClick={() => setPreviewMode('desktop')}
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                            size="sm"
                      className={previewMode === 'desktop' ? 'bg-blue-500' : 'border-slate-600 text-slate-300'}
                          >
                      <Monitor className="h-4 w-4" />
                          </Button>
                        <Button
                      onClick={() => setPreviewMode('tablet')}
                      variant={previewMode === 'tablet' ? 'default' : 'outline'}
                          size="sm"
                      className={previewMode === 'tablet' ? 'bg-blue-500' : 'border-slate-600 text-slate-300'}
                        >
                      <Smartphone className="h-4 w-4" />
                        </Button>
                    <Button
                      onClick={() => setPreviewMode('mobile')}
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      className={previewMode === 'mobile' ? 'bg-blue-500' : 'border-slate-600 text-slate-300'}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-slate-400 mb-4">{currentProject.description}</p>
                <div className="flex items-center gap-4">
                  <Badge className={`${
                    currentProject.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                    currentProject.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {currentProject.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="h-4 w-4" />
                    {currentProject.estimatedDuration} minutes
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <BookOpen className="h-4 w-4" />
                    {currentProject.lessons.length} lessons
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons Preview */}
            <div className="space-y-4">
              {currentProject.lessons.map((lesson, index) => (
                <Card key={lesson.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{lesson.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="capitalize">{lesson.type} lesson</span>
                          <span>{lesson.duration} minutes</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                    
                    {lesson.content && (
                      <div className="bg-slate-700/50 rounded p-4">
                        <p className="text-slate-300 text-sm line-clamp-3">
                          {lesson.type === 'quiz' ? 'Interactive quiz content...' : lesson.content}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
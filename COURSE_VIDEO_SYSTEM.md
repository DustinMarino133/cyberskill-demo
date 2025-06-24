# Course Video System Documentation

## Overview
CyberSkill.AI features a comprehensive YouTube-style course video system that provides an immersive learning experience with progress tracking, module organization, and interactive features.

## System Architecture

### File Structure
```
src/app/student/courses/
├── page.tsx                 # Course catalog and browsing
├── [courseId]/
│   └── page.tsx            # Individual course video player
```

### Core Components

#### 1. Course Video Player (`src/app/student/courses/[courseId]/page.tsx`)
**Lines 1-595 (24KB)**

**Key Features:**
- **YouTube-style Layout**: Split-screen design with collapsible sidebar and main video area
- **Real YouTube Videos**: Embedded actual cybersecurity educational content
- **Progress Tracking**: Individual video progress with watch time persistence
- **Module Organization**: Hierarchical structure with modules and videos
- **Interactive Controls**: Play/pause, volume, fullscreen, and progress tracking

**Technical Implementation:**

**Video Data Structure (Lines 19-47):**
```typescript
interface CourseVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;          // YouTube thumbnail URLs
  videoUrl: string;           // YouTube embed URLs
  completed: boolean;
  locked: boolean;            // Progressive unlocking
  watchTime: number;          // Resume functionality
  totalTime: number;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  videos: CourseVideo[];
  completed: boolean;
  totalDuration: string;
}
```

**Core Functionality:**

**1. Video Selection & Unlocking (Lines 243-252):**
```typescript
const handleVideoSelect = (video: CourseVideo) => {
  if (video.locked) {
    toast.error('Complete previous videos to unlock this content');
    return;
  }
  setCurrentVideo(video);
  setIsPlaying(false);
  setCurrentTime(video.watchTime);  // Resume from last position
};
```

**2. Progress Tracking (Lines 253-275):**
```typescript
const markVideoComplete = (videoId: string) => {
  const updatedCourse = { ...course };
  updatedCourse.modules.forEach(module => {
    module.videos.forEach(video => {
      if (video.id === videoId) {
        video.completed = true;
        video.watchTime = video.totalTime;
        
        // Auto-unlock next video
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
```

**3. Progress Calculations (Lines 276-291):**
```typescript
const getProgressPercentage = () => {
  const totalVideos = course.modules.reduce((sum, module) => sum + module.videos.length, 0);
  const completedVideos = course.modules.reduce((sum, module) => 
    sum + module.videos.filter(video => video.completed).length, 0);
  return Math.round((completedVideos / totalVideos) * 100);
};
```

## Video Content Structure

### Module 1: Getting Started with Cybersecurity (Lines 88-130)
1. **Welcome to Cybersecurity** (8:42)
   - YouTube: `inWWhr5tnEA`
   - Introduction to course and digital asset protection
   - **Status**: Completed ✅

2. **What is Cybersecurity?** (12:18)
   - YouTube: `z5rRZdiu1UE`
   - Definition, scope, and importance of cybersecurity
   - **Status**: Completed ✅

3. **Types of Cyber Threats** (15:30)
   - YouTube: `Dk-ZqQ-bfy4`
   - Malware, phishing, and social engineering
   - **Status**: In Progress (26% watched)

4. **Cybersecurity Frameworks** (18:45)
   - YouTube: `9OGWaVCm1p0`
   - NIST and ISO 27001 frameworks
   - **Status**: Locked 🔒

### Module 2: Network Security Fundamentals (Lines 131-173)
1. **Network Basics for Security** (22:15)
   - YouTube: `3QhU9jd03a0`
   - Network protocols and topology
   - **Status**: Locked 🔒

2. **Firewalls and Network Defense** (19:30)
   - YouTube: `kDEX1HXybrU`
   - Firewall configuration and security
   - **Status**: Locked 🔒

3. **Intrusion Detection Systems** (25:10)
   - YouTube: `72_a6YrqQAs`
   - IDS/IPS systems and attack prevention
   - **Status**: Locked 🔒

### Module 3: Cryptography and Data Protection (Lines 174-206)
1. **Introduction to Cryptography** (20:45)
   - YouTube: `jhXCTbFnK8o`
   - Encryption and decryption basics
   - **Status**: Locked 🔒

2. **Symmetric vs Asymmetric Encryption** (17:25)
   - YouTube: `AQDCe585Lnc`
   - Encryption method differences
   - **Status**: Locked 🔒

## User Interface Features

### Sidebar Navigation (Lines 310-450)
- **Collapsible Design**: Toggle sidebar with smooth animations
- **Course Overview**: Title, description, instructor info
- **Progress Indicators**: Overall course progress and module progress
- **Video Thumbnails**: Real YouTube thumbnails with overlay indicators
- **Progressive Unlocking**: Visual lock icons for locked content
- **Watch Progress**: Progress bars for partially watched videos

### Main Video Area (Lines 451-550)
- **Embedded YouTube Player**: Full-screen capable with standard controls
- **Video Information**: Title, description, duration, and student count
- **Action Buttons**: Mark complete, share functionality
- **Skills Display**: Course learning objectives
- **Instructor Profile**: Instructor information and credentials

### Interactive Elements (Lines 350-380)
```typescript
// Video thumbnail with progress overlay
<div className="relative">
  <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded" />
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
```

## Theme Integration

The course video system is fully integrated with the theme system:

### Theme-Aware Styling (Lines 320-340)
```typescript
style={{ 
  backgroundColor: currentVideo?.id === video.id 
    ? `${currentTheme.colors.primary}20` 
    : `${currentTheme.colors.surface}50`,
  ringColor: currentVideo?.id === video.id ? currentTheme.colors.primary : 'transparent'
}}
```

### Progress Bar Theming (Lines 400-410)
```typescript
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="h-2 rounded-full transition-all duration-300"
    style={{ 
      width: `${getProgressPercentage()}%`,
      backgroundColor: currentTheme.colors.primary
    }}
  />
</div>
```

## User Experience Features

### 1. Progressive Learning
- Videos unlock sequentially as previous ones are completed
- Clear visual indicators for locked, in-progress, and completed content
- Automatic progression through course modules

### 2. Resume Functionality
- Watch time tracking for each video
- Resume from last watched position
- Progress persistence across sessions

### 3. Course Statistics
- Overall course completion percentage
- Module-level progress tracking
- Individual video completion status
- Time investment tracking

### 4. Educational Metadata
- Skill tags for each course
- Instructor information and credentials
- Student enrollment numbers
- Course ratings and reviews

## Technical Specifications

### Performance Optimizations
- **Lazy Loading**: YouTube videos load on demand
- **Thumbnail Caching**: Efficient image loading with YouTube CDN
- **State Management**: Efficient React state updates for progress tracking
- **Animation Performance**: Smooth transitions with Framer Motion

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for video selection
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Theme-aware color schemes for visibility
- **Focus Management**: Clear focus indicators for interactive elements

### Mobile Responsiveness
- **Responsive Layout**: Adapts to different screen sizes
- **Touch Interactions**: Optimized for mobile touch interfaces
- **Sidebar Behavior**: Collapsible sidebar for mobile viewing
- **Video Player**: Full-screen support on mobile devices

## Integration Points

### 1. Course Catalog Integration
- Links from course catalog to individual course pages
- Course enrollment tracking and prerequisites
- Certificate generation upon completion

### 2. Progress Tracking System
- Integration with student dashboard progress displays
- XP and achievement system integration
- Learning analytics and reporting

### 3. Theme System Integration
- Complete theme compatibility across all components
- Dynamic color scheme application
- Consistent styling with rest of application

## Future Enhancements

### Planned Features
1. **Interactive Quizzes**: Embedded quizzes within video content
2. **Note Taking**: Student annotations and timestamped notes
3. **Discussion Forums**: Video-specific discussion threads
4. **Offline Viewing**: Download functionality for offline access
5. **Adaptive Learning**: AI-powered content recommendations
6. **Live Sessions**: Integration with live streaming capabilities

### Technical Improvements
1. **Video Analytics**: Detailed watching behavior analysis
2. **Bandwidth Optimization**: Adaptive video quality based on connection
3. **Search Functionality**: Full-text search within video transcripts
4. **Bookmark System**: Save specific video timestamps
5. **Speed Controls**: Variable playback speed options

## Conclusion

The course video system provides a comprehensive, YouTube-style learning experience that combines professional video content with advanced progress tracking and user experience features. The system is designed to scale with additional courses and modules while maintaining high performance and accessibility standards.

The integration of real YouTube educational content ensures high-quality learning materials while the progressive unlocking system encourages structured learning progression. The theme-aware design and responsive layout provide a consistent experience across all devices and user preferences. 
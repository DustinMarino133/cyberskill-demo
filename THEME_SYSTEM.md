# CyberSkill.AI Theming System Documentation

## Overview

The CyberSkill.AI platform features a comprehensive theming system that allows users to customize the entire visual experience across all pages. The system provides 5 distinct themes, each designed to enhance the cybersecurity education experience with unique color schemes and visual effects.

## Architecture

### Theme Context Provider (`src/contexts/ThemeContext.tsx`)

The theming system is built around React Context, providing centralized theme management with persistent storage.

**Key Components:**
- **Theme Interface** (Lines 7-27): Defines the structure for themes including colors and styling classes
- **Theme Definitions** (Lines 29-141): Five pre-built themes with complete color palettes
- **ThemeProvider Component** (Lines 159-204): Manages theme state and applies CSS custom properties

```typescript
// Theme interface structure
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradient: string;
  };
  styles: {
    cardClass: string;
    buttonClass: string;
    inputClass: string;
    navbarClass: string;
    backgroundPattern: string;
  };
}
```

### Available Themes

#### 1. Cyberpunk (Default - Lines 31-48)
- **Primary Color**: #536DE2 (Raza's preferred blue)
- **Visual Style**: Professional cyberpunk aesthetic with blue/cyan accents
- **Background**: Slate dark with radial gradients
- **Best For**: Professional learning environments

#### 2. Neon Dreams (Lines 49-66)
- **Primary Color**: #FF00FF (Magenta)
- **Visual Style**: Retro neon aesthetic with pink/cyan color scheme
- **Background**: Deep space black with neon gradients
- **Best For**: Creative and artistic users

#### 3. Matrix Green (Lines 67-84)
- **Primary Color**: #00FF41 (Matrix green)
- **Visual Style**: Classic hacker aesthetic inspired by The Matrix
- **Background**: Pure black with green accents
- **Best For**: Traditional cybersecurity enthusiasts

#### 4. Deep Ocean (Lines 85-102)
- **Primary Color**: #0EA5E9 (Ocean blue)
- **Visual Style**: Deep sea aesthetic with blue tones
- **Background**: Dark ocean colors with blue gradients
- **Best For**: Calm, focused learning sessions

#### 5. Cyber Sunset (Lines 103-120)
- **Primary Color**: #F97316 (Orange)
- **Visual Style**: Warm sunset colors with orange/red gradients
- **Background**: Dark warm tones with sunset effects
- **Best For**: Evening study sessions

## Implementation Details

### Theme Provider Integration

The ThemeProvider is integrated at the root level in `src/app/layout.tsx` (Lines 22-45):

```tsx
// Root layout integration
<ThemeProvider>
  {children}
  <Toaster />
</ThemeProvider>
```

### Dynamic Theme Application (Lines 174-187)

The system automatically applies themes through:

1. **CSS Custom Properties**: Theme colors are injected as CSS variables
2. **Background Patterns**: Dynamic background gradients and patterns
3. **Component Styling**: Theme-aware class applications

```typescript
useEffect(() => {
  localStorage.setItem('selectedTheme', themeId);
  
  // Apply theme CSS custom properties to document root
  const theme = themes[themeId];
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  // Apply background pattern
  document.body.style.background = `${theme.colors.background} ${theme.styles.backgroundPattern}`;
  document.body.style.backgroundAttachment = 'fixed';
}, [themeId]);
```

### Theme Usage in Components

Components access the theme through the `useTheme` hook:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { currentTheme, setTheme, themeId } = useTheme();

// Apply theme colors dynamically
<div style={{ color: currentTheme.colors.text }}>
  <Card className={currentTheme.styles.cardClass}>
    Content styled with current theme
  </Card>
</div>
```

## Settings Page (`src/app/student/settings/page.tsx`)

The Settings page provides a comprehensive interface for theme management and user preferences.

### Theme Selection Interface (Lines 234-304)

Visual theme selector with:
- **Live Preview**: Each theme shows a color palette and mini preview
- **Interactive Selection**: Click to apply theme instantly
- **Visual Feedback**: Selected theme highlighted with check mark
- **Smooth Transitions**: Hover effects and animations

```tsx
// Theme selection grid implementation
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {Object.values(themes).map((theme) => (
    <motion.div
      key={theme.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setTheme(theme.id);
        toast.success(`Switched to ${theme.name} theme! 🎨`);
      }}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all`}
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: themeId === theme.id ? theme.colors.primary : 'transparent'
      }}
    >
      {/* Theme preview content */}
    </motion.div>
  ))}
</div>
```

### Additional Settings Features

1. **Profile Settings** (Lines 306-341): User information management
2. **Notifications** (Lines 343-365): Notification preferences
3. **Accessibility** (Lines 380-425): Font size, contrast, and motion settings
4. **Performance** (Lines 427-449): Animation and performance toggles

## Cross-Platform Integration

### Navbar Integration

The navbar (`src/components/shared/Navbar.tsx`) includes a Settings link in the user profile dropdown (Lines 137-143):

```tsx
<button 
  onClick={() => router.push('/student/settings')}
  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent flex items-center space-x-2"
>
  <Settings className="h-4 w-4" />
  <span>Settings</span>
</button>
```

### Global Application

All major pages implement theme support:

1. **Dashboard Pages**: Dynamic backgrounds and component styling
2. **AI Tools**: Consistent theming across quiz builder, flashcards, course builder
3. **Course Pages**: Theme-aware cards, buttons, and content areas
4. **Authentication**: Login page adapts to selected theme

## Persistence and Storage

### Local Storage Integration (Lines 164-172)

Themes are automatically saved and restored:

```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme && themes[savedTheme]) {
    setThemeId(savedTheme);
  }
}, []);
```

### Settings Persistence

User settings including theme preferences are stored in `localStorage` under the `selectedTheme` key, ensuring themes persist across browser sessions.

## Performance Considerations

### Optimized Rendering

- **CSS Custom Properties**: Efficient theme switching without re-rendering components
- **Background Patterns**: GPU-accelerated gradients and effects
- **Selective Updates**: Only theme-dependent styles are updated on theme change

### Animation Control

Theme system respects user preferences for reduced motion and provides performance toggles in the settings page.

## Benefits for User Experience

### Educational Enhancement

1. **Personalization**: Users can choose themes that match their learning style
2. **Mood Setting**: Different themes for different study sessions (focus, creativity, etc.)
3. **Accessibility**: High contrast and text size options for diverse needs
4. **Professional Appeal**: Cyberpunk theme maintains professional appearance

### Technical Benefits

1. **Consistency**: Unified theming across all platform components
2. **Maintainability**: Centralized theme management
3. **Extensibility**: Easy to add new themes or modify existing ones
4. **Performance**: Efficient CSS-based theme switching

## Usage Instructions for Raza

### Accessing Theme Settings

1. **Login** to the student dashboard with `student@demo.com`
2. **Click** on your profile picture in the top-right navbar
3. **Select** "Settings" from the dropdown menu
4. **Navigate** to the Theme Selection section

### Switching Themes

1. **Browse** the 5 available theme options
2. **Preview** each theme with the color palette and mini preview
3. **Click** on any theme to apply it instantly
4. **Enjoy** the new visual experience across all pages

### Customization Options

- **Font Size**: Adjust text size for better readability
- **Animations**: Toggle smooth animations on/off
- **Notifications**: Configure theme-aware notification preferences
- **Performance**: Optimize for your device capabilities

The theming system transforms the entire CyberSkill.AI experience, making it truly personalized while maintaining the professional cybersecurity education focus you wanted. Each theme is carefully crafted to enhance learning while providing visual variety and personal expression. 
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 
  | 'purple-pink'     // Default
  | 'blue-cyan'       
  | 'green-emerald'   
  | 'orange-red'      
  | 'yellow-amber'    
  | 'teal-blue'       
  | 'indigo-purple'   
  | 'rose-pink'       
  | 'lime-green'      
  | 'violet-purple'   
  | 'cyan-teal'       
  | 'amber-orange'
  | 'emerald-green'
  | 'slate-gray'
  | 'crimson-red';

export type AppTheme = 'light' | 'dark';

interface ThemeConfig {
  appTheme: AppTheme;
  colorTheme: ColorTheme;
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderColor: string;
  textPrimary: string;
    textSecondary: string;
  textMuted: string;
}

const COLOR_THEMES: Record<ColorTheme, {
  name: string;
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}> = {
  'purple-pink': {
    name: 'Purple Pink',
    primaryGradient: 'from-purple-500 to-pink-500',
    secondaryGradient: 'from-purple-400 to-pink-400',
    accentGradient: 'from-purple-600 to-pink-600',
    primaryColor: '#9333ea',
    secondaryColor: '#ec4899',
    accentColor: '#a855f7'
  },
  'blue-cyan': {
    name: 'Ocean Blue',
    primaryGradient: 'from-blue-500 to-cyan-500',
    secondaryGradient: 'from-blue-400 to-cyan-400',
    accentGradient: 'from-blue-600 to-cyan-600',
    primaryColor: '#3b82f6',
    secondaryColor: '#06b6d4',
    accentColor: '#0ea5e9'
  },
  'green-emerald': {
    name: 'Forest Green',
    primaryGradient: 'from-green-500 to-emerald-500',
    secondaryGradient: 'from-green-400 to-emerald-400',
    accentGradient: 'from-green-600 to-emerald-600',
    primaryColor: '#22c55e',
    secondaryColor: '#10b981',
    accentColor: '#059669'
  },
  'orange-red': {
    name: 'Sunset Fire',
    primaryGradient: 'from-orange-500 to-red-500',
    secondaryGradient: 'from-orange-400 to-red-400',
    accentGradient: 'from-orange-600 to-red-600',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    accentColor: '#dc2626'
  },
  'yellow-amber': {
    name: 'Golden Sun',
    primaryGradient: 'from-yellow-500 to-amber-500',
    secondaryGradient: 'from-yellow-400 to-amber-400',
    accentGradient: 'from-yellow-600 to-amber-600',
    primaryColor: '#eab308',
    secondaryColor: '#f59e0b',
    accentColor: '#d97706'
  },
  'teal-blue': {
    name: 'Tropical Waters',
    primaryGradient: 'from-teal-500 to-blue-500',
    secondaryGradient: 'from-teal-400 to-blue-400',
    accentGradient: 'from-teal-600 to-blue-600',
    primaryColor: '#14b8a6',
    secondaryColor: '#3b82f6',
    accentColor: '#0d9488'
  },
  'indigo-purple': {
    name: 'Midnight Sky',
    primaryGradient: 'from-indigo-500 to-purple-500',
    secondaryGradient: 'from-indigo-400 to-purple-400',
    accentGradient: 'from-indigo-600 to-purple-600',
    primaryColor: '#6366f1',
    secondaryColor: '#9333ea',
    accentColor: '#7c3aed'
  },
  'rose-pink': {
    name: 'Rose Garden',
    primaryGradient: 'from-rose-500 to-pink-500',
    secondaryGradient: 'from-rose-400 to-pink-400',
    accentGradient: 'from-rose-600 to-pink-600',
    primaryColor: '#f43f5e',
    secondaryColor: '#ec4899',
    accentColor: '#e11d48'
  },
  'lime-green': {
    name: 'Electric Lime',
    primaryGradient: 'from-lime-500 to-green-500',
    secondaryGradient: 'from-lime-400 to-green-400',
    accentGradient: 'from-lime-600 to-green-600',
    primaryColor: '#84cc16',
    secondaryColor: '#22c55e',
    accentColor: '#65a30d'
  },
  'violet-purple': {
    name: 'Royal Violet',
    primaryGradient: 'from-violet-500 to-purple-500',
    secondaryGradient: 'from-violet-400 to-purple-400',
    accentGradient: 'from-violet-600 to-purple-600',
    primaryColor: '#8b5cf6',
    secondaryColor: '#9333ea',
    accentColor: '#7c3aed'
  },
  'cyan-teal': {
    name: 'Arctic Ice',
    primaryGradient: 'from-cyan-500 to-teal-500',
    secondaryGradient: 'from-cyan-400 to-teal-400',
    accentGradient: 'from-cyan-600 to-teal-600',
    primaryColor: '#06b6d4',
    secondaryColor: '#14b8a6',
    accentColor: '#0891b2'
  },
  'amber-orange': {
    name: 'Autumn Blaze',
    primaryGradient: 'from-amber-500 to-orange-500',
    secondaryGradient: 'from-amber-400 to-orange-400',
    accentGradient: 'from-amber-600 to-orange-600',
    primaryColor: '#f59e0b',
    secondaryColor: '#f97316',
    accentColor: '#d97706'
  },
  'emerald-green': {
    name: 'Emerald Forest',
    primaryGradient: 'from-emerald-500 to-green-500',
    secondaryGradient: 'from-emerald-400 to-green-400',
    accentGradient: 'from-emerald-600 to-green-600',
    primaryColor: '#10b981',
    secondaryColor: '#22c55e',
    accentColor: '#059669'
  },
  'slate-gray': {
    name: 'Steel Gray',
    primaryGradient: 'from-slate-500 to-gray-500',
    secondaryGradient: 'from-slate-400 to-gray-400',
    accentGradient: 'from-slate-600 to-gray-600',
    primaryColor: '#64748b',
    secondaryColor: '#6b7280',
    accentColor: '#475569'
  },
  'crimson-red': {
    name: 'Crimson Flame',
    primaryGradient: 'from-red-500 to-rose-500',
    secondaryGradient: 'from-red-400 to-rose-400',
    accentGradient: 'from-red-600 to-rose-600',
    primaryColor: '#ef4444',
    secondaryColor: '#f43f5e',
    accentColor: '#dc2626'
  }
};

const getThemeConfig = (appTheme: AppTheme, colorTheme: ColorTheme): ThemeConfig => {
  const colorConfig = COLOR_THEMES[colorTheme];
  
  return {
    appTheme,
    colorTheme,
    ...colorConfig,
    backgroundColor: appTheme === 'dark' ? '#000000' : '#ffffff',
    surfaceColor: appTheme === 'dark' ? '#111111' : '#f8fafc',
    borderColor: appTheme === 'dark' ? colorConfig.primaryColor + '30' : colorConfig.primaryColor + '20',
    textPrimary: appTheme === 'dark' ? '#ffffff' : '#1f2937',
    textSecondary: appTheme === 'dark' ? '#d1d5db' : '#4b5563',
    textMuted: appTheme === 'dark' ? '#9ca3af' : '#6b7280'
  };
};

interface ThemeContextType {
  theme: ThemeConfig;
  appTheme: AppTheme;
  colorTheme: ColorTheme;
  toggleAppTheme: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  availableColorThemes: Array<{ id: ColorTheme; name: string }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [appTheme, setAppTheme] = useState<AppTheme>('dark');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('purple-pink');

  useEffect(() => {
    // Load theme from localStorage
    const savedAppTheme = localStorage.getItem('appTheme') as AppTheme;
    const savedColorTheme = localStorage.getItem('colorTheme') as ColorTheme;
    
    if (savedAppTheme && ['light', 'dark'].includes(savedAppTheme)) {
      setAppTheme(savedAppTheme);
    }
    
    if (savedColorTheme && COLOR_THEMES[savedColorTheme]) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('appTheme', appTheme);
    localStorage.setItem('colorTheme', colorTheme);
    
    // Apply theme to document
    const themeConfig = getThemeConfig(appTheme, colorTheme);
    
    // Remove previous theme classes
    document.documentElement.classList.remove('light', 'dark');
    document.body.classList.remove('light', 'dark');
    
    // Add current theme class
    document.documentElement.classList.add(appTheme);
    document.body.classList.add(appTheme);
    
    // Apply theme styles to body
    if (appTheme === 'light') {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1f2937';
    } else {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    }
    
    // Set CSS custom properties for dynamic theming
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeConfig.primaryColor);
    root.style.setProperty('--secondary-color', themeConfig.secondaryColor);
    root.style.setProperty('--accent-color', themeConfig.accentColor);
    root.style.setProperty('--background-color', themeConfig.backgroundColor);
    root.style.setProperty('--surface-color', themeConfig.surfaceColor);
    root.style.setProperty('--text-primary', themeConfig.textPrimary);
    root.style.setProperty('--text-secondary', themeConfig.textSecondary);
    root.style.setProperty('--text-muted', themeConfig.textMuted);
  }, [appTheme, colorTheme]);

  const toggleAppTheme = () => {
    setAppTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSetColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
  };

  const availableColorThemes = Object.entries(COLOR_THEMES).map(([id, config]) => ({
    id: id as ColorTheme,
    name: config.name
  }));

  const theme = getThemeConfig(appTheme, colorTheme);

  const value: ThemeContextType = {
    theme,
    appTheme,
    colorTheme,
    toggleAppTheme,
    setColorTheme: handleSetColorTheme,
    availableColorThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 

// Export for backwards compatibility
export const currentTheme = 'purple-pink';
export { ThemeContext }; 
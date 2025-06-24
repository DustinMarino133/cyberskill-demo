'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const themes: Record<string, Theme> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      primary: '#536DE2',
      secondary: '#00D4FF',
      accent: '#00FF41',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#00FF41',
      warning: '#FFA500',
      error: '#FF4444',
      gradient: 'linear-gradient(135deg, #536DE2 0%, #00D4FF 100%)'
    },
    styles: {
      cardClass: 'bg-slate-800/50 border-slate-700 backdrop-blur-sm',
      buttonClass: 'hover:scale-105 transition-all duration-200',
      inputClass: 'bg-slate-800 border-slate-600 text-slate-100',
      navbarClass: 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700',
      backgroundPattern: 'radial-gradient(circle at 25% 25%, #536DE2 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00D4FF 0%, transparent 50%)'
    }
  },
  neon: {
    id: 'neon',
    name: 'Neon Dreams',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#000014',
      surface: '#1A0A2E',
      text: '#FFFFFF',
      textSecondary: '#C0C0C0',
      border: '#2D1B69',
      success: '#00FF88',
      warning: '#FF8800',
      error: '#FF0066',
      gradient: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)'
    },
    styles: {
      cardClass: 'bg-purple-900/30 border-purple-500/50 backdrop-blur-sm shadow-lg shadow-purple-500/20',
      buttonClass: 'hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300',
      inputClass: 'bg-purple-900/50 border-purple-400 text-white',
      navbarClass: 'bg-black/90 backdrop-blur-md border-b border-purple-500/50',
      backgroundPattern: 'radial-gradient(circle at 20% 80%, #FF00FF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00FFFF 0%, transparent 50%)'
    }
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Green',
    colors: {
      primary: '#00FF41',
      secondary: '#00CC33',
      accent: '#66FF66',
      background: '#000000',
      surface: '#0A0A0A',
      text: '#00FF41',
      textSecondary: '#00AA2B',
      border: '#003311',
      success: '#00FF41',
      warning: '#FFAA00',
      error: '#FF4444',
      gradient: 'linear-gradient(135deg, #00FF41 0%, #00AA2B 100%)'
    },
    styles: {
      cardClass: 'bg-black/80 border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10',
      buttonClass: 'hover:shadow-lg hover:shadow-green-400/50 transition-all duration-200',
      inputClass: 'bg-black border-green-500 text-green-400',
      navbarClass: 'bg-black/95 backdrop-blur-md border-b border-green-500/50',
      backgroundPattern: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 65, 0.03) 50%, transparent 100%)'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#38BDF8',
      background: '#0C1222',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#475569',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)'
    },
    styles: {
      cardClass: 'bg-slate-800/60 border-blue-500/30 backdrop-blur-sm',
      buttonClass: 'hover:scale-105 transition-all duration-200',
      inputClass: 'bg-slate-700 border-blue-400 text-slate-100',
      navbarClass: 'bg-slate-900/90 backdrop-blur-md border-b border-blue-400/50',
      backgroundPattern: 'radial-gradient(circle at 30% 40%, #0EA5E9 0%, transparent 50%), radial-gradient(circle at 70% 80%, #0284C7 0%, transparent 50%)'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Cyber Sunset',
    colors: {
      primary: '#F97316',
      secondary: '#DC2626',
      accent: '#FBBF24',
      background: '#1A0B0B',
      surface: '#2D1B1B',
      text: '#FEF2F2',
      textSecondary: '#FCA5A5',
      border: '#7C2D12',
      success: '#16A34A',
      warning: '#F59E0B',
      error: '#DC2626',
      gradient: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)'
    },
    styles: {
      cardClass: 'bg-red-900/30 border-orange-500/40 backdrop-blur-sm shadow-lg shadow-orange-500/10',
      buttonClass: 'hover:shadow-lg hover:shadow-orange-400/50 transition-all duration-300',
      inputClass: 'bg-red-900/50 border-orange-400 text-orange-100',
      navbarClass: 'bg-red-950/90 backdrop-blur-md border-b border-orange-500/50',
      backgroundPattern: 'radial-gradient(circle at 25% 75%, #F97316 0%, transparent 50%), radial-gradient(circle at 75% 25%, #DC2626 0%, transparent 50%)'
    }
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeId, setThemeId] = useState('cyberpunk');

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes[savedTheme]) {
      setThemeId(savedTheme);
    }
  }, []);

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

  const setTheme = (newThemeId: string) => {
    if (themes[newThemeId]) {
      setThemeId(newThemeId);
    }
  };

  const value = {
    currentTheme: themes[themeId],
    setTheme,
    themeId,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
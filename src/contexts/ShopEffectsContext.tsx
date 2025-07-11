'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

interface CursorEffect {
  id: string;
  name: string;
  cssClass: string;
  trailEffect?: boolean;
  soundEffect?: string;
}

interface XPBooster {
  id: string;
  multiplier: number;
  expiresAt: number;
  duration: string;
}

interface ShopEffectsContextType {
  // Cursors
  activeCursor: CursorEffect | null;
  availableCursors: CursorEffect[];
  setCursor: (cursorId: string) => void;
  
  // XP Boosters
  activeBooster: XPBooster | null;
  applyXPBooster: (boosterId: string, multiplier: number, duration: number) => void;
  calculateXP: (baseXP: number) => number;
  
  // Themes (integrates with ThemeContext)
  equipShopTheme: (themeId: string) => void;
  
  // Equipped items management
  equippedItems: string[];
  updateEquippedItems: (items: string[]) => void;
  
  // Reset functionality
  resetToDefaults: () => void;
}

const CURSOR_EFFECTS: Record<string, CursorEffect> = {
  'cursor-default': {
    id: 'cursor-default',
    name: 'Default Cursor',
    cssClass: 'default-cursor',
    trailEffect: false
  },
  'cursor-cyber': {
    id: 'cursor-cyber',
    name: 'Cyber Cursor',
    cssClass: 'cyber-cursor',
    trailEffect: true
  },
  'cursor-flame': {
    id: 'cursor-flame',
    name: 'Flame Cursor',
    cssClass: 'flame-cursor',
    trailEffect: true
  },
  'cursor-lightning': {
    id: 'cursor-lightning',
    name: 'Lightning Cursor',
    cssClass: 'lightning-cursor',
    trailEffect: true
  },
  'cursor-galaxy': {
    id: 'cursor-galaxy',
    name: 'Galaxy Cursor',
    cssClass: 'galaxy-cursor',
    trailEffect: true
  }
};

const THEME_MAPPINGS: Record<string, string> = {
  'theme-default': 'blue-cyan',
  'theme-ocean': 'blue-cyan',
  'theme-forest': 'green-emerald',
  'theme-sunset': 'orange-red',
  'theme-crimson': 'crimson-red'
};

const ShopEffectsContext = createContext<ShopEffectsContextType | undefined>(undefined);

export const useShopEffects = () => {
  const context = useContext(ShopEffectsContext);
  if (context === undefined) {
    throw new Error('useShopEffects must be used within a ShopEffectsProvider');
  }
  return context;
};

interface ShopEffectsProviderProps {
  children: React.ReactNode;
}

export const ShopEffectsProvider: React.FC<ShopEffectsProviderProps> = ({ children }) => {
  const { setColorTheme } = useTheme();
  const [activeCursor, setActiveCursor] = useState<CursorEffect | null>(null);
  const [activeBooster, setActiveBooster] = useState<XPBooster | null>(null);
  const [equippedItems, setEquippedItems] = useState<string[]>([]);

  // Load equipped items and apply effects on mount
  useEffect(() => {
    const loadEquippedItems = () => {
      try {
        // Always start with defaults (no green cursor, 9999 coins, no purchases)
        const defaultItems = ['cursor-default', 'theme-default'];
        setEquippedItems(defaultItems);
        applyEquippedEffects(defaultItems);
        
        // Clear any existing shop purchases and set 9999 coins
        localStorage.setItem('equippedItems', JSON.stringify(defaultItems));
        localStorage.setItem('userCoins', '9999');
        localStorage.removeItem('shopPurchases'); // Clear any existing purchases
        
      } catch (error) {
        console.error('Error loading equipped items:', error);
        const defaultItems = ['cursor-default', 'theme-default'];
        setEquippedItems(defaultItems);
        applyEquippedEffects(defaultItems);
        localStorage.setItem('equippedItems', JSON.stringify(defaultItems));
        localStorage.setItem('userCoins', '9999');
      }
    };

    loadEquippedItems();
  }, []);

  // Load active booster from localStorage
  useEffect(() => {
    const loadActiveBooster = () => {
      try {
        const savedBooster = localStorage.getItem('activeXPBooster');
        if (savedBooster) {
          const booster = JSON.parse(savedBooster);
          if (booster.expiresAt > Date.now()) {
            setActiveBooster(booster);
          } else {
            // Booster expired, remove it
            localStorage.removeItem('activeXPBooster');
          }
        }
      } catch (error) {
        console.error('Error loading active booster:', error);
      }
    };

    loadActiveBooster();
    
    // Check booster expiration every minute
    const interval = setInterval(loadActiveBooster, 60000);
    return () => clearInterval(interval);
  }, []);

  const applyEquippedEffects = (items: string[]) => {
    // Apply cursor effects
    const equippedCursor = items.find(item => item.startsWith('cursor-'));
    if (equippedCursor && CURSOR_EFFECTS[equippedCursor]) {
      setActiveCursor(CURSOR_EFFECTS[equippedCursor]);
      applyCursorStyles(CURSOR_EFFECTS[equippedCursor]);
    } else {
      // Default to default cursor if no cursor found
      setActiveCursor(CURSOR_EFFECTS['cursor-default']);
      applyCursorStyles(CURSOR_EFFECTS['cursor-default']);
    }

    // Apply theme effects
    const equippedTheme = items.find(item => item.startsWith('theme-'));
    if (equippedTheme && THEME_MAPPINGS[equippedTheme]) {
      setColorTheme(THEME_MAPPINGS[equippedTheme] as any);
    } else {
      // Default to default theme if no theme found
      setColorTheme('blue-cyan');
    }
  };

  const applyCursorStyles = (cursor: CursorEffect) => {
    // Remove existing cursor classes
    document.body.classList.remove(...Object.values(CURSOR_EFFECTS).map(c => c.cssClass));
    
    // Clean up existing cursor trail
    const existingTrail = document.getElementById('cursor-trail');
    if (existingTrail) {
      existingTrail.remove();
    }
    
    // Clean up existing cursor cleanup function
    if ((window as any).cursorTrailCleanup) {
      (window as any).cursorTrailCleanup();
    }
    
    // If it's default cursor, don't add any classes or trails
    if (cursor.id === 'cursor-default') {
      return;
    }
    
    // Add new cursor class
    document.body.classList.add(cursor.cssClass);
    
    // Add cursor trail effect if enabled
    if (cursor.trailEffect) {
      addCursorTrailEffect(cursor);
    }
  };

  const addCursorTrailEffect = (cursor: CursorEffect) => {
    // Remove existing trail
    const existingTrail = document.getElementById('cursor-trail');
    if (existingTrail) {
      existingTrail.remove();
    }

    // Create trail container
    const trailContainer = document.createElement('div');
    trailContainer.id = 'cursor-trail';
    trailContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(trailContainer);

    let particles: HTMLElement[] = [];
    let mouseX = 0;
    let mouseY = 0;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = `cursor-particle ${cursor.cssClass}-particle`;
      
      // Set particle styles based on cursor type
      const particleStyles = getCursorParticleStyles(cursor.id);
      particle.style.cssText = particleStyles.base;
      particle.style.left = mouseX + 'px';
      particle.style.top = mouseY + 'px';
      
      trailContainer.appendChild(particle);
      particles.push(particle);
      
      // Animate particle
      requestAnimationFrame(() => {
        particle.style.cssText += particleStyles.animate;
      });
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        particles = particles.filter(p => p !== particle);
      }, 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create particle every few pixels moved
      if (Math.random() < 0.3) {
        createParticle();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function
    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (trailContainer.parentNode) {
        trailContainer.parentNode.removeChild(trailContainer);
      }
    };

    // Store cleanup function for later use
    (window as any).cursorTrailCleanup = cleanup;
  };

  const getCursorParticleStyles = (cursorId: string) => {
    switch (cursorId) {
      case 'cursor-flame':
        return {
          base: `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ff6b35, #f7931e, #ffcb05);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.8s ease-out;
          `,
          animate: `
            opacity: 0;
            transform: translate(-50%, -150%) scale(2);
            background: radial-gradient(circle, #ff1100, #ff6600);
          `
        };
      case 'cursor-lightning':
        return {
          base: `
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #00ffff, #0099ff);
            border-radius: 50%;
            box-shadow: 0 0 10px #00ffff;
            transform: translate(-50%, -50%);
            transition: all 0.6s ease-out;
          `,
          animate: `
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
            box-shadow: 0 0 20px #00ffff, 0 0 30px #0099ff;
          `
        };
      case 'cursor-galaxy':
        return {
          base: `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #9d4edd, #7209b7);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 1s ease-out;
          `,
          animate: `
            opacity: 0;
            transform: translate(-50%, -50%) scale(4);
            background: radial-gradient(circle, #ffd23f, #ff8c42);
          `
        };
      case 'cursor-cyber':
        return {
          base: `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #00ff41;
            border-radius: 1px;
            box-shadow: 0 0 5px #00ff41;
            transform: translate(-50%, -50%);
            transition: all 0.5s ease-out;
          `,
          animate: `
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
            box-shadow: 0 0 10px #00ff41;
          `
        };
      default:
        return {
          base: `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #3b82f6;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.5s ease-out;
          `,
          animate: `opacity: 0; transform: translate(-50%, -50%) scale(2);`
        };
    }
  };

  const setCursor = (cursorId: string) => {
    if (CURSOR_EFFECTS[cursorId]) {
      setActiveCursor(CURSOR_EFFECTS[cursorId]);
      applyCursorStyles(CURSOR_EFFECTS[cursorId]);
    }
  };

  const resetToDefaults = () => {
    const defaultItems = ['cursor-default', 'theme-default'];
    setEquippedItems(defaultItems);
    localStorage.setItem('equippedItems', JSON.stringify(defaultItems));
    applyEquippedEffects(defaultItems);
  };

  const applyXPBooster = (boosterId: string, multiplier: number, durationHours: number) => {
    const expiresAt = Date.now() + (durationHours * 60 * 60 * 1000);
    const booster: XPBooster = {
      id: boosterId,
      multiplier: multiplier / 100, // Convert percentage to decimal
      expiresAt,
      duration: `${durationHours} hour${durationHours !== 1 ? 's' : ''}`
    };
    
    setActiveBooster(booster);
    localStorage.setItem('activeXPBooster', JSON.stringify(booster));
  };

  const calculateXP = (baseXP: number): number => {
    if (activeBooster && activeBooster.expiresAt > Date.now()) {
      return Math.floor(baseXP * (1 + activeBooster.multiplier));
    }
    return baseXP;
  };

  const equipShopTheme = (themeId: string) => {
    if (THEME_MAPPINGS[themeId]) {
      setColorTheme(THEME_MAPPINGS[themeId] as any);
    }
  };

  const updateEquippedItems = (items: string[]) => {
    setEquippedItems(items);
    localStorage.setItem('equippedItems', JSON.stringify(items));
    applyEquippedEffects(items);
  };

  // Add cursor styles to document head
  useEffect(() => {
    const addCursorStyles = () => {
      const existingStyles = document.getElementById('cursor-styles');
      if (existingStyles) return;

      const styles = document.createElement('style');
      styles.id = 'cursor-styles';
      styles.textContent = `
        .default-cursor * {
          cursor: default !important;
        }
        
        .cyber-cursor * {
          cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3" fill="%2300ff41" opacity="0.8"/><circle cx="10" cy="10" r="1" fill="%23ffffff"/></svg>') 10 10, auto !important;
        }
        
        .flame-cursor * {
          cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10 2c2 3 4 6 4 10a4 4 0 11-8 0c0-4 2-7 4-10z" fill="%23ff6b35"/></svg>') 10 10, auto !important;
        }
        
        .lightning-cursor * {
          cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M5 2l8 10h-4l2 6-8-10h4z" fill="%2300ffff"/></svg>') 10 10, auto !important;
        }
        
        .galaxy-cursor * {
          cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="%239d4edd" stroke-width="1" opacity="0.6"/><circle cx="10" cy="10" r="2" fill="%23ffd23f"/><circle cx="6" cy="7" r="1" fill="%23ffffff"/><circle cx="14" cy="13" r="1" fill="%23ffffff"/></svg>') 10 10, auto !important;
        }
      `;
      document.head.appendChild(styles);
    };

    addCursorStyles();
  }, []);

  // Cleanup cursor trail on unmount
  useEffect(() => {
    return () => {
      if ((window as any).cursorTrailCleanup) {
        (window as any).cursorTrailCleanup();
      }
    };
  }, []);

  const value: ShopEffectsContextType = {
    activeCursor,
    availableCursors: Object.values(CURSOR_EFFECTS),
    setCursor,
    activeBooster,
    applyXPBooster,
    calculateXP,
    equipShopTheme,
    equippedItems,
    updateEquippedItems,
    resetToDefaults
  };

  return (
    <ShopEffectsContext.Provider value={value}>
      {children}
    </ShopEffectsContext.Provider>
  );
}; 
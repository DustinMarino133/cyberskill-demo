import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        background: "#0a0a0a",
        foreground: "#fafafa",
        
        // Brand colors - Enhanced with better shades
        primary: {
          DEFAULT: "#536DE2", // Raza's preferred brand blue
          50: "#f0f4ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#536DE2",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        
        // Enhanced cyber theme colors
        cyber: {
          blue: "#00d4ff",
          green: "#00ff41",
          purple: "#8b5cf6",
          pink: "#ec4899",
          yellow: "#fbbf24",
        },
        
        // Modern card backgrounds
        card: {
          DEFAULT: "hsl(222.2 84% 4.9%)",
          foreground: "hsl(210 40% 98%)",
        },
        
        // Enhanced secondary colors
        secondary: {
          DEFAULT: "hsl(217.2 32.6% 17.5%)",
          foreground: "hsl(210 40% 98%)",
        },
        
        muted: {
          DEFAULT: "hsl(217.2 32.6% 17.5%)",
          foreground: "hsl(215 20.2% 65.1%)",
        },
        
        accent: {
          DEFAULT: "hsl(217.2 32.6% 17.5%)",
          foreground: "hsl(210 40% 98%)",
        },
        
        destructive: {
          DEFAULT: "hsl(0 62.8% 30.6%)",
          foreground: "hsl(210 40% 98%)",
        },
        
        border: "hsl(217.2 32.6% 17.5%)",
        input: "hsl(217.2 32.6% 17.5%)",
        ring: "#536DE2",
        
        // Additional modern colors
        slate: {
          950: "#020617",
        },
        
        // Glass morphism colors
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          dark: "rgba(0, 0, 0, 0.2)",
        },
      },
      
      // Enhanced animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "flip": "flip 0.6s ease-in-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        flip: {
          "0%": { transform: "rotateY(0)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "rotateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #536DE2" },
          "100%": { boxShadow: "0 0 20px #536DE2, 0 0 30px #536DE2" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      
      // Enhanced background patterns
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(83, 109, 226, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(83, 109, 226, 0.1) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
      },
      
      backgroundSize: {
        'grid': '20px 20px',
        'grid-sm': '10px 10px',
        'grid-lg': '40px 40px',
      },
      
      // Enhanced spacing and sizing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      
      // Glass morphism utilities
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
};
export default config;

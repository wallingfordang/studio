"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const applyTheme = (theme: string) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  // Initialize theme state based on localStorage or system preference
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light'; // Default for SSR
    const storedTheme = localStorage.getItem('agent-computer-theme');
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      return storedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    setMounted(true);
    applyTheme(theme); // Apply initial theme after mount
  }, [theme]); // Re-apply if theme changes through other means (though unlikely here)


  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agent-computer-theme', newTheme);
    }
  }

  if (!mounted) {
    // Render a placeholder or null during SSR/pre-hydration to avoid mismatch
    return <Button variant="ghost" size="icon" className="w-8 h-8 opacity-50 cursor-not-allowed"><Palette className="h-4 w-4" /></Button>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Toggle theme">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

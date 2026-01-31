import { useEffect, useRef, useState } from 'react';
import type { Screen } from '../App';
import { KeyboardHint } from './KeyboardHint';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

interface MenuItem {
  id: Screen;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: 'stats', label: 'Main Stats' },
  { id: 'logs', label: 'Logs' },
  { id: 'settings', label: 'Settings' },
];

export function MainMenu({ onNavigate }: MainMenuProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setFocusedIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onNavigate(menuItems[focusedIndex].id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, onNavigate]);

  useEffect(() => {
    buttonRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-6 px-4 md:px-8">
      <div className="w-full max-w-2xl flex flex-col gap-3 md:gap-4">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={() => setFocusedIndex(index)}
            className={`
              relative bg-[rgba(0,227,255,0.05)] backdrop-blur-sm
              rounded-lg h-20 md:h-24 
              transition-all duration-200
              border-4
              ${focusedIndex === index 
                ? 'border-[rgba(0,227,255,0.8)]' 
                : 'border-[rgba(3,64,120,0.25)] hover:border-[rgba(0,227,255,0.5)]'
              }
            `}
          >
            <span className="text-[#efefef] text-2xl md:text-4xl lg:text-5xl font-['Electrolize',sans-serif]">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <KeyboardHint hints={['↑/↓ or W/S to navigate', 'ENTER to select']} />
    </div>
  );
}
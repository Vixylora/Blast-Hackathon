import { useState, useEffect, useRef } from 'react';
import type { SystemState } from '../App';
import { KeyboardHint } from './KeyboardHint';

interface SettingsViewProps {
  systemState: SystemState;
  onBack: () => void;
  onStateChange: (state: SystemState) => void;
}

interface Setting {
  id: string;
  label: string;
  value: string;
  action?: () => void;
}

export function SettingsView({ systemState, onBack, onStateChange }: SettingsViewProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means back button
  const settingRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const settings: Setting[] = [
    { 
      id: 'state', 
      label: 'Current System State', 
      value: systemState.toUpperCase() 
    },
    { 
      id: 'threshold-ph-high', 
      label: 'pH High Threshold', 
      value: '8.5' 
    },
    { 
      id: 'threshold-ph-low', 
      label: 'pH Low Threshold', 
      value: '6.5' 
    },
    { 
      id: 'threshold-orp', 
      label: 'ORP Target (mV)', 
      value: '650' 
    },
    { 
      id: 'threshold-conductivity', 
      label: 'Conductivity Max (μS/cm)', 
      value: '1000' 
    },
    { 
      id: 'update-interval', 
      label: 'Update Interval (s)', 
      value: '2' 
    },
    { 
      id: 'data-retention', 
      label: 'Data Retention (days)', 
      value: '30' 
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setFocusedIndex((prev) => {
            if (prev <= 0) return -1;
            return prev - 1;
          });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setFocusedIndex((prev) => {
            if (prev >= settings.length - 1) return settings.length - 1;
            return prev + 1;
          });
          break;
        case 'Escape':
        case 'b':
        case 'B':
          e.preventDefault();
          onBack();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex === -1) {
            onBack();
          } else if (settings[focusedIndex].action) {
            settings[focusedIndex].action?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, onBack, settings]);

  useEffect(() => {
    if (focusedIndex === -1) {
      backButtonRef.current?.focus();
    } else {
      settingRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="w-full h-full flex flex-col gap-3 md:gap-4 p-4 md:p-8 overflow-hidden">
      <div className="flex-1 min-h-0 bg-[rgba(0,227,255,0.1)] backdrop-blur-sm rounded-lg border-4 border-[rgba(3,64,120,0.25)] overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3 md:gap-4 p-6 md:p-10">
            {settings.map((setting, index) => (
              <button
                key={setting.id}
                ref={(el) => (settingRefs.current[index] = el)}
                onClick={() => setting.action?.()}
                onMouseEnter={() => setFocusedIndex(index)}
                disabled={!setting.action}
                className={`
                  bg-[rgba(0,227,255,0.05)] rounded-md border-4 transition-all duration-200
                  h-14 md:h-16 flex items-center justify-between px-5 md:px-8
                  ${setting.action ? 'cursor-pointer' : 'cursor-default'}
                  ${focusedIndex === index 
                    ? 'border-[rgba(0,227,255,0.8)]' 
                    : setting.action ? 'border-[rgba(3,64,120,0.25)] hover:border-[rgba(0,227,255,0.5)]' : 'border-[rgba(3,64,120,0.25)]'
                  }
                `}
              >
                <span className="text-white text-base md:text-2xl font-['Electrolize',sans-serif]">
                  {setting.label}
                </span>
                <span className={`text-base md:text-2xl font-['Electrolize',sans-serif] ${
                  setting.id === 'state' 
                    ? systemState === 'safe' 
                      ? 'text-[#57ff1a]' 
                      : systemState === 'warning'
                      ? 'text-[#ffbf00]'
                      : 'text-[#ff1a1a]'
                    : 'text-white'
                }`}>
                  {setting.value}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        ref={backButtonRef}
        onClick={onBack}
        onMouseEnter={() => setFocusedIndex(-1)}
        className={`
          bg-[rgba(0,227,255,0.05)] backdrop-blur-sm rounded-md 
          h-14 md:h-16 shrink-0
          border-4 transition-all duration-200
          ${focusedIndex === -1 
            ? 'border-[rgba(0,227,255,0.8)]' 
            : 'border-[rgba(3,64,120,0.25)] hover:border-[rgba(0,227,255,0.5)]'
          }
        `}
      >
        <span className="text-[#efefef] text-xl md:text-2xl font-['Electrolize',sans-serif]">
          Back
        </span>
      </button>

      <KeyboardHint hints={['↑/↓ or W/S to navigate', 'ENTER to select', 'ESC or B to go back']} />
    </div>
  );
}
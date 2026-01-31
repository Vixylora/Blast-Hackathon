import { useState, useEffect, useRef } from 'react';
import { GlitchBackground } from './components/ui/glitch';
import { MainMenu } from './components/MainMenu';
import { MainStats } from './components/MainStats';
import { LogsView } from './components/LogsView';
import { SettingsView } from './components/SettingsView';

export type SystemState = 'safe' | 'warning' | 'critical';
export type Screen = 'menu' | 'stats' | 'logs' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [systemState, setSystemState] = useState<SystemState>('safe');

  return (
    <GlitchBackground color="#00e3ff" intensity={1.2} scanlines={true}>
      <div className="w-full h-screen overflow-hidden font-['Electrolize',sans-serif] flex items-center justify-center p-4 md:p-8 lg:p-16">
        <div className="w-full h-full max-w-[1400px] flex items-center justify-center">
          {currentScreen === 'menu' && (
            <MainMenu onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'stats' && (
            <MainStats 
              systemState={systemState}
              onBack={() => setCurrentScreen('menu')}
              onStateChange={setSystemState}
            />
          )}
          {currentScreen === 'logs' && (
            <LogsView onBack={() => setCurrentScreen('menu')} />
          )}
          {currentScreen === 'settings' && (
            <SettingsView 
              systemState={systemState}
              onBack={() => setCurrentScreen('menu')}
              onStateChange={setSystemState}
            />
          )}
        </div>
      </div>
      
      <link
        href="https://fonts.googleapis.com/css2?family=Electrolize&display=swap"
        rel="stylesheet"
      />
    </GlitchBackground>
  );
}
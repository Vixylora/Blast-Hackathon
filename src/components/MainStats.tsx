import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { SystemState } from '../App';
import { ChartBar } from './ChartBar';
import { AlertBanner } from './AlertBanner';
import { KeyboardHint } from './KeyboardHint';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MainStatsProps {
  systemState: SystemState;
  onBack: () => void;
  onStateChange: (state: SystemState) => void;
}

interface SensorData {
  pH: number[];
  orp: number[];
  conductivity: number[];
  timestamp: number;
}

interface SensorReading {
  pH: number;
  orp: number;
  conductivity: number;
  timestamp: number;
}

export function MainStats({ systemState, onBack, onStateChange }: MainStatsProps) {
  const [focusedButton, setFocusedButton] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    pH: [7.2],
    orp: [650],
    conductivity: [500],
    timestamp: Date.now(),
  });
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [lastDataTime, setLastDataTime] = useState<number>(Date.now());

  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousStateRef = useRef<SystemState>(systemState);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c0d5887d`;

  // Log system state changes
  useEffect(() => {
    if (previousStateRef.current !== systemState) {
      const logEvent = async () => {
        try {
          await fetch(`${API_URL}/log-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              type: systemState === 'critical' ? 'CRITICAL_ALERT' : systemState === 'warning' ? 'WARNING' : 'SAFE',
              message: systemState === 'critical' 
                ? 'PUMP POWER SEVERED - Dangerous pH detected'
                : systemState === 'warning'
                ? 'Logic alert - pH change detected'
                : 'System normal',
              systemState,
              sensorData: {
                pH: sensorData.pH[sensorData.pH.length - 1],
                orp: sensorData.orp[sensorData.orp.length - 1],
                conductivity: sensorData.conductivity[sensorData.conductivity.length - 1],
              },
            }),
          });
        } catch (error) {
          console.error('Failed to log event:', error);
        }
      };
      
      logEvent();
      previousStateRef.current = systemState;
    }
  }, [systemState, sensorData, API_URL, publicAnonKey]);

  // Fetch real-time sensor data from backend
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch(`${API_URL}/sensor-data/latest`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (response.ok) {
          const reading: SensorReading = await response.json();
          
          setSensorData((prev) => ({
            pH: [...prev.pH.slice(-15), reading.pH],
            orp: [...prev.orp.slice(-15), reading.orp],
            conductivity: [...prev.conductivity.slice(-15), reading.conductivity],
            timestamp: reading.timestamp,
          }));

          setLastDataTime(Date.now());
          setConnectionStatus('connected');
        } else if (response.status === 404) {
          // No data yet, but server is responding
          setConnectionStatus('connected');
        } else {
          console.error('Failed to fetch sensor data:', response.statusText);
          setConnectionStatus('error');
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        setConnectionStatus('error');
      }
    };

    // Initial fetch
    fetchSensorData();

    // Poll for new data every 2 seconds
    const interval = setInterval(fetchSensorData, 2000);

    return () => clearInterval(interval);
  }, [API_URL, publicAnonKey]);

  // Monitor sensor data and update system state
  useEffect(() => {
    if (sensorData.pH.length < 2) return;

    const currentPH = sensorData.pH[sensorData.pH.length - 1];
    const previousPH = sensorData.pH[sensorData.pH.length - 2];
    
    // Calculate rate of change for pH
    const phChange = Math.abs(currentPH - previousPH);
    
    // Determine system state based on pH and rate of change
    if (currentPH > 8.5 || currentPH < 6.5) {
      onStateChange('critical');
    } else if (phChange > 0.5 || currentPH > 8.0 || currentPH < 6.8) {
      onStateChange('warning');
    } else {
      onStateChange('safe');
    }
  }, [sensorData, onStateChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
        case 'b':
        case 'B':
          e.preventDefault();
          onBack();
          break;
        case 'Tab':
          e.preventDefault();
          setFocusedButton((prev) => !prev);
          break;
        case 'Enter':
        case ' ':
          if (focusedButton) {
            e.preventDefault();
            onBack();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedButton, onBack]);

  useEffect(() => {
    if (focusedButton) {
      backButtonRef.current?.focus();
    }
  }, [focusedButton]);

  const getStatusColor = () => {
    switch (systemState) {
      case 'safe':
        return 'bg-[rgba(87,255,26,0.75)]';
      case 'warning':
        return 'bg-[rgba(255,191,0,0.75)]';
      case 'critical':
        return 'bg-[rgba(255,26,26,0.75)]';
    }
  };

  const getStatusText = () => {
    switch (systemState) {
      case 'safe':
        return 'VERIFIED SAFE';
      case 'warning':
        return 'LOGIC ALERT';
      case 'critical':
        return 'PUMP POWER SEVERED - ATTACK BLOCKED';
    }
  };

  const currentPH = sensorData.pH[sensorData.pH.length - 1].toFixed(1);
  const currentORP = Math.round(sensorData.orp[sensorData.orp.length - 1]);
  const currentConductivity = sensorData.conductivity[sensorData.conductivity.length - 1].toFixed(1);

  return (
    <div className="w-full h-full flex flex-col gap-3 md:gap-4 p-4 md:p-8 overflow-hidden">
      <div className="flex-1 min-h-0 bg-[rgba(0,227,255,0.1)] backdrop-blur-sm rounded-lg border-4 border-[rgba(3,64,120,0.25)] overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3 md:gap-4 p-6 md:p-10">
            {/* Status */}
            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] h-14 md:h-16 flex items-center justify-between px-5 md:px-8">
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                Status
              </span>
              <div className={`${getStatusColor()} h-5 w-10 md:h-6 md:w-12 rounded-full shadow-[0_0_10px_currentColor]`} />
            </div>

            <AlertBanner systemState={systemState} />

            <div className="h-px bg-[rgba(0,255,255,0.25)]" />

            {/* pH */}
            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] h-14 md:h-16 flex items-center justify-between px-5 md:px-8">
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                pH
              </span>
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                {currentPH}
              </span>
            </div>

            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] p-5 md:p-8">
              <ChartBar data={sensorData.pH} max={14} label="pH" showMax="7" showMin="0" />
            </div>

            <div className="h-px bg-[rgba(0,255,255,0.25)]" />

            {/* ORP */}
            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] h-14 md:h-16 flex items-center justify-between px-5 md:px-8">
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                ORP
              </span>
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                {currentORP} mV
              </span>
            </div>

            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] p-5 md:p-8">
              <ChartBar data={sensorData.orp} max={1000} label="ORP" showMax="700 mV" showMin="0" />
            </div>

            <div className="h-px bg-[rgba(0,255,255,0.25)]" />

            {/* Conductivity */}
            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] h-14 md:h-16 flex items-center justify-between px-5 md:px-8">
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                Conductivity
              </span>
              <span className="text-white text-lg md:text-2xl font-['Electrolize',sans-serif]">
                {currentConductivity} μS/cm
              </span>
            </div>

            <div className="bg-[rgba(0,227,255,0.1)] rounded-md border-4 border-[rgba(3,64,120,0.25)] p-5 md:p-8">
              <ChartBar data={sensorData.conductivity} max={1000} label="Conductivity" showMax="500 μS/cm" showMin="0" />
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        ref={backButtonRef}
        onClick={onBack}
        onMouseEnter={() => setFocusedButton(true)}
        onMouseLeave={() => setFocusedButton(false)}
        className={`
          bg-[rgba(0,227,255,0.05)] backdrop-blur-sm rounded-md 
          h-14 md:h-16 shrink-0
          border-4 transition-all duration-200
          ${focusedButton 
            ? 'border-[rgba(0,227,255,0.8)]' 
            : 'border-[rgba(3,64,120,0.25)] hover:border-[rgba(0,227,255,0.5)]'
          }
        `}
      >
        <span className="text-[#efefef] text-xl md:text-2xl font-['Electrolize',sans-serif]">
          Back
        </span>
      </button>

      <KeyboardHint hints={['ESC or B to go back', 'TAB to focus button']} />
    </div>
  );
}
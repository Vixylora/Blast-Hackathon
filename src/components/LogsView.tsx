import { useState, useEffect, useRef, useMemo } from 'react';
import svgPaths from '../imports/svg-fyl56ur0ax';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { KeyboardHint } from './KeyboardHint';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LogsViewProps {
  onBack: () => void;
}

interface LogEntry {
  type: string;
  message: string;
  systemState: string;
  timestamp: number;
  sensorData?: {
    pH: number;
    orp: number;
    conductivity: number;
  };
}

export function LogsView({ onBack }: LogsViewProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means back button is focused
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const logRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c0d5887d`;

  // Get unique log types for filtering
  const logTypes = useMemo(() => ['all', ...Array.from(new Set(logEntries.map(log => log.type)))], [logEntries]);

  // Fetch event logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/event-logs?limit=100`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setLogEntries(result.data || []);
        } else {
          console.error('Failed to fetch event logs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching event logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // Refresh logs every 5 seconds
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [API_URL, publicAnonKey]);

  // Filter and search logs
  useEffect(() => {
    let filtered = logEntries;

    // Apply state filter
    if (filterState !== 'all') {
      filtered = filtered.filter(log => log.systemState === filterState);
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type === filterType);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.type.toLowerCase().includes(query) ||
        log.message.toLowerCase().includes(query) ||
        log.systemState.toLowerCase().includes(query) ||
        new Date(log.timestamp).toLocaleDateString().includes(query) ||
        new Date(log.timestamp).toLocaleTimeString().includes(query)
      );
    }

    setFilteredLogs(filtered);
  }, [logEntries, searchQuery, filterState, filterType]);

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
            if (prev >= filteredLogs.length - 1) return filteredLogs.length - 1;
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
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, onBack, filteredLogs.length]);

  useEffect(() => {
    if (focusedIndex === -1) {
      backButtonRef.current?.focus();
    } else {
      logRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="w-full h-full flex flex-col gap-3 md:gap-4 p-4 md:p-8 overflow-hidden">
      <div className="flex-1 min-h-0 bg-[rgba(0,227,255,0.1)] backdrop-blur-sm rounded-lg border-4 border-[rgba(3,64,120,0.25)] overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 border-b-4 border-[rgba(3,64,120,0.25)]">
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 md:h-14 bg-[rgba(0,30,50,0.8)] border-2 border-[rgba(3,64,120,0.4)] rounded-md px-4 md:px-6 text-white text-base md:text-xl font-['Electrolize',sans-serif] placeholder:text-white/40 focus:outline-none focus:border-[rgba(0,227,255,0.6)] transition-all"
            />
          </div>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as 'all' | 'safe' | 'warning' | 'critical')}
            className="h-12 md:h-14 bg-[rgba(0,30,50,0.9)] border-2 border-[rgba(3,64,120,0.4)] rounded-md px-4 md:px-6 pr-10 text-white text-base md:text-xl font-['Electrolize',sans-serif] focus:outline-none focus:border-[rgba(0,227,255,0.6)] transition-all cursor-pointer min-w-[140px] md:min-w-[180px] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2210%22%20height%3d%226%22%20viewBox%3d%220%200%2010%206%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L5%205L9%201%22%20stroke%3d%22white%22%20stroke-width%3d%221.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
          >
            <option value="all" className="bg-[#0a1929] text-white">All States</option>
            <option value="safe" className="bg-[#0a1929] text-white">Safe</option>
            <option value="warning" className="bg-[#0a1929] text-white">Warning</option>
            <option value="critical" className="bg-[#0a1929] text-white">Critical</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-12 md:h-14 bg-[rgba(0,30,50,0.9)] border-2 border-[rgba(3,64,120,0.4)] rounded-md px-4 md:px-6 pr-10 text-white text-base md:text-xl font-['Electrolize',sans-serif] focus:outline-none focus:border-[rgba(0,227,255,0.6)] transition-all cursor-pointer min-w-[140px] md:min-w-[180px] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2210%22%20height%3d%226%22%20viewBox%3d%220%200%2010%206%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L5%205L9%201%22%20stroke%3d%22white%22%20stroke-width%3d%221.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
          >
            {logTypes.map(type => (
              <option key={type} value={type} className="bg-[#0a1929] text-white">
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[calc(100%-80px)] md:h-[calc(100%-94px)] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-6">
            {filteredLogs.length === 0 ? (
              <div className="text-white/50 text-center py-8 text-base md:text-xl font-['Electrolize',sans-serif]">
                {loading ? 'Loading logs...' : 'No logs found'}
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <button
                  key={log.timestamp}
                  ref={(el) => (logRefs.current[index] = el)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`
                    bg-[rgba(0,227,255,0.05)] rounded-md border-4 transition-all duration-200 cursor-pointer
                    h-14 md:h-16 flex items-center justify-between px-5 md:px-8 gap-4
                    ${focusedIndex === index 
                      ? 'border-[rgba(0,227,255,0.8)]' 
                      : 'border-[rgba(3,64,120,0.25)] hover:border-[rgba(0,227,255,0.5)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className="text-white text-sm md:text-xl font-['Electrolize',sans-serif] min-w-[90px] md:min-w-[120px]">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-white text-sm md:text-xl font-['Electrolize',sans-serif] min-w-[70px] md:min-w-[100px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className={`
                      text-sm md:text-lg font-['Electrolize',sans-serif] px-3 py-1 rounded
                      ${log.systemState === 'safe' ? 'text-[#57ff1a] bg-[rgba(87,255,26,0.1)]' : 
                        log.systemState === 'warning' ? 'text-[#ffbf00] bg-[rgba(255,191,0,0.1)]' : 
                        'text-[#ff1a1a] bg-[rgba(255,26,26,0.1)]'}
                    `}>
                      {log.type}
                    </span>
                    <span className="text-white text-sm md:text-xl font-['Electrolize',sans-serif]">
                      {log.message}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-7 md:h-7 text-white shrink-0" />
                </button>
              ))
            )}
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

      <KeyboardHint hints={['↑/↓ or W/S to navigate', 'ESC or B to go back']} />
    </div>
  );
}
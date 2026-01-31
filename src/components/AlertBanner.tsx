import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { memo } from 'react';
import type { SystemState } from '../App';

interface AlertBannerProps {
  systemState: SystemState;
}

export const AlertBanner = memo(function AlertBanner({ systemState }: AlertBannerProps) {
  if (systemState === 'safe') {
    return (
      <div className="bg-[rgba(87,255,26,0.2)] border-4 border-[rgba(87,255,26,0.5)] rounded-md p-4 md:p-6 flex items-center gap-4 shadow-[0_0_20px_rgba(87,255,26,0.3)]">
        <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-[#57ff1a] shrink-0" />
        <div className="flex-1">
          <h3 className="text-[#57ff1a] text-lg md:text-2xl font-['Electrolize',sans-serif] mb-1">
            VERIFIED SAFE
          </h3>
          <p className="text-white/80 text-sm md:text-base font-['Electrolize',sans-serif]">
            All chemical parameters within normal operating range. Chemistry verification active.
          </p>
        </div>
      </div>
    );
  }

  if (systemState === 'warning') {
    return (
      <div className="bg-[rgba(255,191,0,0.2)] border-4 border-[rgba(255,191,0,0.5)] rounded-md p-4 md:p-6 flex items-center gap-4 shadow-[0_0_20px_rgba(255,191,0,0.3)] animate-pulse">
        <AlertTriangle className="w-8 h-8 md:w-12 md:h-12 text-[#ffbf00] shrink-0" />
        <div className="flex-1">
          <h3 className="text-[#ffbf00] text-lg md:text-2xl font-['Electrolize',sans-serif] mb-1">
            ⚠ LOGIC ALERT - ANOMALY DETECTED
          </h3>
          <p className="text-white/80 text-sm md:text-base font-['Electrolize',sans-serif]">
            Rate of chemical change inconsistent with safe dosing parameters. Monitoring elevated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(255,26,26,0.3)] border-4 border-[rgba(255,26,26,0.7)] rounded-md p-4 md:p-6 flex items-center gap-4 shadow-[0_0_30px_rgba(255,26,26,0.5)] animate-pulse">
      <ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-[#ff1a1a] shrink-0 animate-pulse" />
      <div className="flex-1">
        <h3 className="text-[#ff1a1a] text-lg md:text-2xl font-['Electrolize',sans-serif] mb-1">
          🚨 PUMP POWER SEVERED - ATTACK BLOCKED
        </h3>
        <p className="text-white/90 text-sm md:text-base font-['Electrolize',sans-serif]">
          Physics violation detected. Emergency relay triggered. Chemical injection pump disabled.
        </p>
      </div>
    </div>
  );
});
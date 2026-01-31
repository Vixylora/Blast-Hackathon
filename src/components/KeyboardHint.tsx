interface KeyboardHintProps {
  hints: string[];
}

export function KeyboardHint({ hints }: KeyboardHintProps) {
  return (
    <div className="text-[rgba(0,227,255,0.5)] text-xs md:text-sm text-center shrink-0 font-['Electrolize',sans-serif]">
      <p>{hints.join(' • ')}</p>
    </div>
  );
}

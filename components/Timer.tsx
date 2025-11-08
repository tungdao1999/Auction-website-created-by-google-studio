
import React from 'react';
import { useTimer } from '../hooks/useTimer';

interface TimerProps {
  endDate: Date;
}

const TimerBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-2 w-16 h-16">
    <span className="text-xl font-bold text-primary">{String(value).padStart(2, '0')}</span>
    <span className="text-xs text-subtle uppercase">{label}</span>
  </div>
);

export const Timer: React.FC<TimerProps> = ({ endDate }) => {
  const { days, hours, minutes, seconds, isOver } = useTimer(endDate);

  if (isOver) {
    return (
      <div className="text-center font-bold text-xl text-red-600 bg-red-100 py-3 px-4 rounded-lg">
        Auction Ended
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-subtle mb-2 text-center">Time Remaining</h3>
      <div className="flex justify-center gap-2 sm:gap-4">
        {days > 0 && <TimerBlock value={days} label="Days" />}
        <TimerBlock value={hours} label="Hours" />
        <TimerBlock value={minutes} label="Mins" />
        <TimerBlock value={seconds} label="Secs" />
      </div>
    </div>
  );
};

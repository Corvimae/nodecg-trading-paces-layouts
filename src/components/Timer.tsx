import React from 'react';

export const Timer: React.FC = () => {
  const [timer] = cartographer.useReplicant<{ time: string } | null>('timer', null, {
    namespace: 'nodecg-speedcontrol',
  });
  
  return (
    <div className="timer-bar__timer-value">
      {[...(timer?.time ?? '0:00:00')].map((char, index) => (
        <div key={index} className="timer-bar__timer-value-character">{char}</div>
      ))}
    </div>
  );
}
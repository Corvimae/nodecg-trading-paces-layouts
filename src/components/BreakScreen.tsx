import React from 'react';
import { BreakSchedule } from './BreakSchedule';
import { SUPPLIMENTARIES_MODULE_NAME } from '../utils/utils';

interface BreakTitleProps {
  text?: string;
}

export const BreakTitle: React.FC<BreakTitleProps> = ({ text }) => (
  <div className="break-screen__title">{text}</div>
);

interface BreakTextProps {
  text?: string;
  className?: string;
}

export const BreakText: React.FC<BreakTextProps> = ({ text, className }) => {
  const lines = cartographer.useMemo(() => {
    return text?.split('\n') ?? [];
  }, [text]);

  return (
    <div className={`break-screen__text ${className ?? ''}`}>
      {lines.map((line, index) => (
        <div key={index}><p>{line}</p></div>
      ))}
    </div>
  );
};

interface BreakAlertProps {
  text?: string;
}

export const BreakAlert: React.FC<BreakAlertProps> = ({ text }) => (
  <BreakText className="break-screen__alert" text={text} />
);

export const BreakCountdown: React.FC = () => {
  const [countdownSecondsRemaining] = cartographer.useReplicant<number>('countdownSecondsRemaining', 0, {
    namespace: SUPPLIMENTARIES_MODULE_NAME,
  });
  
  const minutesRemaining = Math.floor(countdownSecondsRemaining / 60);
  const secondsRemainder = countdownSecondsRemaining - minutesRemaining * 60;
  const countdownText = `${minutesRemaining < 10 ? `0${minutesRemaining}` : minutesRemaining}:${secondsRemainder < 10 ? `0${secondsRemainder}` : secondsRemainder}`;
  
  return (
    <BreakAlert text={`Service from Trading Paces station begins ${countdownSecondsRemaining === 0 ? 'momentarily' : `in ${countdownText}`}.`} />
  );
}
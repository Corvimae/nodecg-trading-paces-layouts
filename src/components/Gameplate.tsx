import React from 'react';
import classnames from 'classnames';

function normalizeConsoleAbbreviation(name: string) {
  const lowercaseName = name.toLowerCase();

  if (lowercaseName.includes('switch 2')) return 'NS2';
  if (lowercaseName.includes('switch')) return 'NS';
  if (lowercaseName.includes('3ds')) return '3DS';
  if (lowercaseName.includes('ds')) return 'DS';
  if (lowercaseName.includes('playstation 5')) return 'PS5';
  if (lowercaseName.includes('playstation 4')) return 'PS4';
  if (lowercaseName.includes('playstation 3')) return 'PS3';
  if (lowercaseName.includes('playstation 2')) return 'PS2';
  if (lowercaseName.includes('playstation')) return 'PS1';

  return name.substring(0, 4).trim().toUpperCase();
}
export const Gameplate = ({}) => {
 const [runDataActiveRun] = cartographer.useReplicant<Speedcontrol.ActiveRun | null>('runDataActiveRun', null, {
    namespace: 'nodecg-speedcontrol',
  });

  const consoleLetters = cartographer.useMemo(() => [
    ...normalizeConsoleAbbreviation(runDataActiveRun?.system ?? '')
  ], [runDataActiveRun]);

  const [timer] = cartographer.useReplicant<{ time: string } | null>('timer', null, {
    namespace: 'nodecg-speedcontrol',
  });

  const gameplateClasses = classnames('gameplate', {
    'gameplate--long-title': (runDataActiveRun?.game ?? '').length > 25,
  })

  return (
    <div className={gameplateClasses}>
      <div className="gameplate__texture" />
      <div className="gameplate__top-row">
        <div className="gameplate__title">{runDataActiveRun?.game}</div>
        {consoleLetters.map((letter, index) => (
          <div key={index} className={`gameplate__console-letter gameplate__console-letter--slot-${index}`}>
            {letter}
          </div>
        ))}
      </div>
      <div className="gameplate__bottom-row">
        <div className="gameplate__bottom-row-info">
          <div className="gameplate__category">{runDataActiveRun?.category}</div>
          <div className="gameplate__estimate">Approx. {runDataActiveRun?.estimate}</div>
        </div>
        <div className="gameplate__timer">
          {[...(timer?.time ?? '0:00:00')].map((char, index) => (
            <div key={index} className="timer-bar__timer-value-character">{char}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
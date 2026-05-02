import React from 'react';

export const TimerBar = () => {
  const [timer] = cartographer.useReplicant<{ time: string } | null>('timer', null, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <div className="timer-bar">
      <div className="timer-bar__corner">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 50C55.9953 50.114 50.1148 56.0538 50 64H0C3.12689e-05 28.86 28.6314 0.126097 64 0V50Z" fill="#63269B"/>
        </svg>
      </div>
      <div className="timer-bar__header">
        Trading Paces 2026
      </div>
      <div className="timer-bar__timer-container">
        <svg width="465" height="238" viewBox="0 0 465 238" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M465 -24.7148L344.792 95.4932L344.789 95.4902C333.249 106.808 317.445 113.83 300 113.893V114H130C126.22 114.054 122.915 115.408 120.466 117.657L120.493 117.685L0.28418 237.893L-35 202.608L85.208 82.4004L85.21 82.4023C96.7497 71.0848 112.555 64.0622 130 64H300V63.8926C303.78 63.8388 307.085 62.4851 309.534 60.2354L309.507 60.208L429.716 -60L465 -24.7148Z" fill="#00AD42"/>
          <path d="M116 128H115.644L116.009 127.634C116.004 127.755 116.002 127.877 116 128Z" fill="#00AD42"/>
          <path d="M313.991 50.2588C313.996 50.1374 313.998 50.015 314 49.8926H314.356L313.991 50.2588Z" fill="#00AD42"/>
        </svg>
        <div className="timer-bar__timer-value">
          {[...(timer?.time ?? '0:00:00')].map((char, index) => (
            <div key={index} className="timer-bar__timer-value-character">{char}</div>
          ))}
        </div>
      </div>
      <div className="timer-bar__left-bar">

      </div>
    </div>
  )
}
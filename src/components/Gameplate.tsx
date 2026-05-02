import React from 'react';

export const Gameplate = ({}) => {
 const [runDataActiveRun] = cartographer.useReplicant<Speedcontrol.ActiveRun | null>('runDataActiveRun', null, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <div className="gameplate">
      <div className="gameplate__left-column">
        <div className="gameplate__this-is">This is</div>
        <div className="gameplate__title">{runDataActiveRun?.game}</div>
      </div>
      <div className="gameplate__right-column">
        <div>{runDataActiveRun?.category}</div>
        <div className="gameplate__estimate">in {runDataActiveRun?.estimate}</div>
      </div>
    </div>
  );
}
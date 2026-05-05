import React from 'react';
import { Nameplate, NameplateProps } from './Nameplate';

export const CameraOverlay = () => {
  const [runDataActiveRun] = cartographer.useReplicant<Speedcontrol.ActiveRun | null>('runDataActiveRun', null, {
    namespace: 'nodecg-speedcontrol',
  });
  
  const headsets = cartographer.useMemo(() => {
    const hostTeam = runDataActiveRun?.teams.find((team) => team.name.toLocaleLowerCase().includes('host'))?.players ?? [];
    const commentaryTeam = runDataActiveRun?.teams.find((team) => team.name.toLocaleLowerCase().includes('commenta'))?.players ?? [];
    const runnerTeams = runDataActiveRun?.teams.filter((team) => {
      const lowerTeamName = team.name.toLocaleLowerCase();
      return !lowerTeamName.includes('commenta') && !lowerTeamName.includes('host');
    }).map((team) => team.players) ?? [];

    return [
      ...runnerTeams.flatMap((runnerTeam) => (
        runnerTeam.map((player) => ({
          player,
          type: 'runner',
        } as NameplateProps))
      )),
      ...commentaryTeam.map((player) => ({
        player,
        type: 'commentator',
      } as NameplateProps)),
      ...hostTeam.map((player) => ({
        player,
        type: 'host',
      } as NameplateProps)),
    ];
  }, [runDataActiveRun]);

  return (
    <div className="camera-overlay">
      <div className="event-title-bar">
        <div className="event-title-bar__name">Trading Paces</div>
        <div className="event-title-bar__year">2026</div>
      </div>
      <div className="nameplates">
        {headsets.map((headset, index) => (
          <Nameplate key={index} {...headset} />
        ))}
      </div>
    </div>
  );
}
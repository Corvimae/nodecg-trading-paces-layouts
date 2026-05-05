import React from 'react';
import { add } from 'date-fns';
import { pluralizeWithValue } from '../utils/utils';

const UPCOMING_RUNS_DISPLAYED = 3;

interface UpcomingRunData {
  run: Speedcontrol.Run;
  estimatedStart: Date;
  runOffset: number;
}

const BreakScheduleItem: React.FC<UpcomingRunData> = ({
  run,
  estimatedStart,
  runOffset
}) => {
  const runners = cartographer.useMemo(() => {
    const runnerData = run.teams.filter((team) => {
      const lowerTeamName = team.name.toLocaleLowerCase();
      return !lowerTeamName.includes('commenta') && !lowerTeamName.includes('host');
    }).flatMap((team) => team.players) ?? [];

    return runnerData.map((runner) => runner.name);
  }, [run]);

  const humanizedStart = cartographer.useMemo(() => {
    const diff = estimatedStart.getTime() - Date.now();
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff - (diffHours * 1000 * 60 * 60)) / (60000))

    if (diffHours === 0 && diffMinutes < 1) return 'Momentarily';

    if (diffHours === 0) {
      return `in ${pluralizeWithValue(diffMinutes, 'minute')}`;
    }

    if (diffMinutes === 0) {
      return `in ${pluralizeWithValue(diffHours, 'hour')}`;
    }

    return `in ${pluralizeWithValue(diffHours, 'hour')}, ${pluralizeWithValue(diffMinutes, 'minute')}`
  }, [estimatedStart]);

  return (
    <div className="break-screen__schedule-item">
      <div className="break-screen__schedule-item-left-column">
        <div className="break-screen__schedule-item-title">{run.game}</div>
        <div className="break-screen__schedule-item-subtitle">
          via {runners.join(', ')} — expected {run.estimate}
        </div>
      </div>
      <div className="break-screen__schedule-item-right-column">
        {runOffset > 0 && (
          <div className="break-screen__schedule-item-departing">
            Departing
          </div>
        )}
        <div className="break-screen__schedule-item-estimated-start">
          {runOffset === 0 ? 'Departing Now' : humanizedStart}
        </div>
      </div>
    </div>
  );
}

export const BreakSchedule: React.FC = () => {
  const [runDataArray] = cartographer.useReplicant<Speedcontrol.Run[]>('runDataArray', [], {
    namespace: 'nodecg-speedcontrol',
  });

  const [runDataActiveRun] = cartographer.useReplicant<Speedcontrol.Run | null>('runDataActiveRun', null, {
    namespace: 'nodecg-speedcontrol',
  });
  
  const upcomingRuns: UpcomingRunData[] = cartographer.useMemo(() => {
    if (!runDataActiveRun) return [];

    const currentRunIndex = runDataArray.findIndex((item) => item.id === runDataActiveRun.id);

    if (currentRunIndex === -1) return [];

    const actualItemCount = Math.min(runDataArray.length, UPCOMING_RUNS_DISPLAYED);

    const [upcomingRuns] = [...new Array(actualItemCount)].reduce(([list, estimatedStart], _, index) => {
      const run = runDataArray[currentRunIndex + index];

      if (run) {
        return [
          [
            ...list,
            {
              run,
              estimatedStart,
              runOffset: index,
            }
          ],
          add(estimatedStart, { seconds: run.estimateS + run.setupTimeS }),
        ];
      }

      return [list, estimatedStart];
    }, [[], new Date()]);

    return upcomingRuns;
  }, [runDataArray, runDataActiveRun]);

  return (
    <div className="break-screen__schedule">
      {upcomingRuns.map((props) => (
        <BreakScheduleItem key={props.run.id} {...props} />
      ))}
    </div>
  )
}
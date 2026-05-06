import { Gameplate } from './components/Gameplate';
import { IncentiveView } from './components/IncentiveView';
import { CameraOverlay } from './components/CameraOverlay';
import { BreakAlert, BreakText, BreakTitle, BreakCountdown } from './components/BreakScreen';
import { BreakSchedule } from './components/BreakSchedule';
import { BreakGrid } from './components/BreakGrid';
import { LowerThirds } from './components/LowerThirds';

cartographer.register('gameplate', Gameplate);
cartographer.register('camera-overlay', CameraOverlay);
cartographer.register('incentive-view', IncentiveView);
cartographer.register('lower-thirds', LowerThirds);

cartographer.register('break-screen-title', BreakTitle);
cartographer.register('break-screen-text', BreakText);
cartographer.register('break-screen-countdown', BreakCountdown);
cartographer.register('break-screen-alert', BreakAlert);
cartographer.register('break-screen-schedule', BreakSchedule);
cartographer.register('break-screen-grid', BreakGrid);
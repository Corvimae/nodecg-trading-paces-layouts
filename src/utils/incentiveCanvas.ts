import { BitmapCanvas } from "./bitmapCanvas";
import { formatCurrency } from "./utils";

const GRID_WIDTH = 316;
const GRID_HEIGHT = 27;

export type BidwarOption = { name: string; total: number; };

export function useIncentiveCanvas() {
  const [grid, setGrid] = cartographer.useState<boolean[]>([]);
  const canvasRef = cartographer.useRef(new BitmapCanvas(GRID_WIDTH, GRID_HEIGHT));

  return cartographer.useMemo(() => {
    function drawBidwarOption(name: string, value: number, startX: number) {
      const canvas = canvasRef.current;

      const formattedValue = formatCurrency(value);
      const nameWidth = canvas.getStringWidth(name);
      const valueWidth = canvas.getStringWidth(formattedValue);
    
      canvas.drawOutlineRect(startX, 12, startX + nameWidth + valueWidth + 9, 24);
      canvas.drawString(name, startX + 3, 15);
      canvas.drawFilledRect(startX + nameWidth + 6, 14, startX + nameWidth + valueWidth + 7, 22);
      canvas.drawString(formattedValue, startX + nameWidth + 7, 15, { inverse: true });
    
      return startX + nameWidth + valueWidth + 9;
    }

    function drawBidwarTotalRaised(options: BidwarOption[]) {
      const canvas = canvasRef.current;

      const totalRaised = options.reduce((acc, { total }) => acc + total, 0);
      const formattedTotalRaised = `${formatCurrency(totalRaised)} raised`;

      canvas.drawString(
        formattedTotalRaised,
        canvas.width - canvas.getStringWidth(formattedTotalRaised) - 4,
        2
      );
    }

    function drawBidwar(name: string, options: BidwarOption[]) {
      const canvas = canvasRef.current;

      canvas.blank();

      canvas.drawString(name, 4, 2);
      
      drawBidwarTotalRaised(options);

      let dx = 0;

      for (let option of options) {
        dx = drawBidwarOption(option.name, option.total, dx + 4);
      }

      setGrid(canvas.points);
    }

    function drawTarget(name: string, current: number, goal: number) {
      const canvas = canvasRef.current;

      canvas.blank();

      canvas.drawString(name, 4, 2);

      const formattedCurrent = formatCurrency(current);
      const formattedGoal = formatCurrency(goal);
      const totalString = `${formattedCurrent} / ${formattedGoal}`;

      canvas.drawString(totalString, canvas.width - canvas.getStringWidth(totalString) - 4, 2);

      canvas.drawOutlineRect(4, 12, canvas.width - 4, canvas.height - 3);
      const maxBarWidth = canvas.width - 12;
      const barWidth = Math.floor(maxBarWidth * Math.min(1, current / goal));
      canvas.drawFilledRect(6, 14, 6 + barWidth, canvas.height - 5);
      
      const formattedPercent = `${Math.min(Math.floor(100 * current / goal), 100)}%`
      canvas.drawString(formattedPercent, 6 + barWidth - canvas.getStringWidth(formattedPercent) - 1, 15, { inverse: true });
   
      setGrid(canvas.points);
    }

    function drawBinaryBidwar(name: string, options: BidwarOption[]) {
      const canvas = canvasRef.current;

      canvas.blank();

      canvas.drawString(name, 4, 2);
      drawBidwarTotalRaised(options);

      const isFirstOptionWinning = options[0].total >= options[1].total;
      const isSecondOptionWinning = options[1].total >= options[0].total;

      const optionWidth = Math.floor(canvas.width - 12) / 2;

      canvas.drawRect(4, 12, optionWidth + 4, 24, isFirstOptionWinning);

      const rightRectStartX = canvas.width - optionWidth - 4;
      canvas.drawRect(rightRectStartX, 12, canvas.width - 4, 24, isSecondOptionWinning);

      canvas.drawString(options[0].name, 6, 15, { inverse: isFirstOptionWinning });

      const formattedFirstValue = formatCurrency(options[0].total); 
      canvas.drawString(
        formattedFirstValue,
        optionWidth - canvas.getStringWidth(formattedFirstValue) + 4 - 2,
        15,
        { inverse: isFirstOptionWinning },
      );

      canvas.drawString(options[1].name, rightRectStartX + 2, 15, { inverse: isSecondOptionWinning });

      const formattedSecondValue = formatCurrency(options[1].total); 
      canvas.drawString(
        formattedSecondValue,
        canvas.width - canvas.getStringWidth(formattedSecondValue) - 4 - 2,
        15,
        { inverse: isSecondOptionWinning },
      );

      setGrid(canvas.points);
    }

    function drawDonationCTA(frame = 0) {
      const canvas = canvasRef.current;

      canvas.blank();

      const ctaMessage = 'Donate now at hanginout.live/donate!';
      const normalizedOffset = frame % (canvas.width + canvas.getStringWidth(ctaMessage));

      canvas.drawString(ctaMessage, canvas.width - normalizedOffset, 10);
      
      setGrid(canvas.points);
    }

    return {
      grid,
      internal: canvasRef.current,
      gridStyle: { gridTemplateColumns: `repeat(${canvasRef.current.width}, max-content)`},
      drawBidwar,
      drawTarget,
      drawBinaryBidwar,
      drawDonationCTA
    }
  }, [grid])
}
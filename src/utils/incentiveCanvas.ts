import { BitmapCanvas } from "./bitmapCanvas";
import { formatCurrency } from "./utils";

const GRID_WIDTH = 316;
const GRID_HEIGHT = 27;

export type BidwarOption = { name: string; total: number; };

function bindAnimationUtils(canvas: BitmapCanvas, frame: number) {
  return {
    animateUpwards(goalY: number, startOffset = 0) {
      return Math.max(canvas.height - frame + startOffset, goalY);
    },
    animateDownwards(goalY: number, startOffset = 10) {
      return Math.min(goalY, -startOffset + frame);
    },
    animateLeftwards(goalX: number, rate = 1, startOffset: number | null = null) {
      return Math.max(goalX, canvas.width + (startOffset === null ? goalX : startOffset) - (frame * rate));
    }
  };
}

export function useIncentiveCanvas() {
  const [grid, setGrid] = cartographer.useState<boolean[]>([]);
  const canvasRef = cartographer.useRef(new BitmapCanvas(GRID_WIDTH, GRID_HEIGHT));

  return cartographer.useMemo(() => {
    function drawBidwarOption(name: string, value: number, startX: number, frame: number) {
      const canvas = canvasRef.current;
      const animationUtils = bindAnimationUtils(canvas, frame);

      const formattedValue = formatCurrency(value);
      const nameWidth = canvas.getStringWidth(name);
      const valueWidth = canvas.getStringWidth(formattedValue);
    
      canvas.drawOutlineRect(
        animationUtils.animateLeftwards(startX, 15),
        12,
        animationUtils.animateLeftwards(startX + nameWidth + valueWidth + 9, 15),
        24
      );

      canvas.drawString(
        name,
        animationUtils.animateLeftwards(startX + 3, 15),
        15
      );

      canvas.drawFilledRect(
        animationUtils.animateLeftwards(startX + nameWidth + 6, 15),
        14, 
        animationUtils.animateLeftwards(startX + nameWidth + valueWidth + 7, 15),
        22
      );

      canvas.drawString(
        formattedValue, 
        animationUtils.animateLeftwards(startX + nameWidth + 7, 15),
        15, 
        { inverse: true },
      );
    
      return startX + nameWidth + valueWidth + 9;
    }

    function drawBidwarTotalRaised(options: BidwarOption[], frame: number) {
      const canvas = canvasRef.current;
      const animationUtils = bindAnimationUtils(canvas, frame);
      const totalRaised = options.reduce((acc, { total }) => acc + total, 0);
      const formattedTotalRaised = `${formatCurrency(totalRaised)} raised`;

      canvas.drawString(
        formattedTotalRaised,
        canvas.width - canvas.getStringWidth(formattedTotalRaised) - 4,
        animationUtils.animateDownwards(2, 13),
      );
    }

    function drawBidwar(name: string, options: BidwarOption[], frame: number) {
      const canvas = canvasRef.current;
      const animationUtils = bindAnimationUtils(canvas, frame);

      canvas.blank();

      canvas.drawString(name, 4, animationUtils.animateDownwards(2, 13));
      
      drawBidwarTotalRaised(options, frame);

      let dx = 0;

      for (let option of options) {
        dx = drawBidwarOption(option.name, option.total, dx + 4, frame);
      }

      setGrid(canvas.points);
    }

    function drawTarget(name: string, current: number, goal: number, frame: number) {
      const canvas = canvasRef.current;
      const animationUtils = bindAnimationUtils(canvas, frame);

      canvas.blank();

      canvas.drawString(name, 4, animationUtils.animateDownwards(2));

      const formattedCurrent = formatCurrency(current);
      const formattedGoal = formatCurrency(goal);
      const totalString = `${formattedCurrent} / ${formattedGoal}`;

      canvas.drawString(
        totalString,
        canvas.width - canvas.getStringWidth(totalString) - 4,
        animationUtils.animateDownwards(2)
      );

      const outlineAnimInScale = Math.min(1, frame / 10);
      if (outlineAnimInScale > 0) {
        canvas.drawOutlineRect(
          4,
          12,
          Math.floor((canvas.width - 4) * outlineAnimInScale),
          canvas.height - 3
        );
      }

      const maxBarWidth = canvas.width - 12;
      const percent = Math.max(0, current / goal);
      const fillAnimInScale = Math.max(0, Math.min(1, (frame - 10) / 10));
      const barWidth = Math.floor(maxBarWidth * percent * fillAnimInScale);

      if (percent > 0 && fillAnimInScale > 0) {
        canvas.drawFilledRect(6, 14, 6 + barWidth, canvas.height - 5);
      }

      const formattedPercent = `${Math.min(Math.floor(100 * current / goal), 100)}%`
      canvas.drawString(
        formattedPercent,
        Math.max(8, 6 + barWidth - canvas.getStringWidth(formattedPercent) - 1),
        15,
        { inverse: true }
      );
   
      setGrid(canvas.points);
    }

    function drawBinaryBidwar(name: string, options: BidwarOption[], frame: number) {
      const canvas = canvasRef.current;
      const animationUtils = bindAnimationUtils(canvas, frame);

      canvas.blank();
    
      canvas.drawString(name, 4, animationUtils.animateDownwards(2, 13));
      drawBidwarTotalRaised(options, frame);

      const isFirstOptionWinning = options[0].total >= options[1].total;
      const isSecondOptionWinning = options[1].total >= options[0].total;

      const optionWidth = Math.floor(canvas.width - 12) / 2;

      canvas.drawRect(
        4,
        animationUtils.animateUpwards(12),
        optionWidth + 4,
        animationUtils.animateUpwards(24),
        isFirstOptionWinning
      );

      const rightRectStartX = canvas.width - optionWidth - 4;
      canvas.drawRect(
        rightRectStartX,
        animationUtils.animateUpwards(12),
        canvas.width - 4,
        animationUtils.animateUpwards(24),
        isSecondOptionWinning
      );

      canvas.drawString(
        options[0].name,
        6,
        animationUtils.animateUpwards(15, 3),
        { inverse: isFirstOptionWinning }
      );

      const formattedFirstValue = formatCurrency(options[0].total); 
      canvas.drawString(
        formattedFirstValue,
        optionWidth - canvas.getStringWidth(formattedFirstValue) + 4 - 2,
        animationUtils.animateUpwards(15, 3),
        { inverse: isFirstOptionWinning },
      );

      canvas.drawString(
        options[1].name,
        rightRectStartX + 2,
        animationUtils.animateUpwards(15, 3),
        { inverse: isSecondOptionWinning },
      );

      const formattedSecondValue = formatCurrency(options[1].total); 
      canvas.drawString(
        formattedSecondValue,
        canvas.width - canvas.getStringWidth(formattedSecondValue) - 4 - 2,
        animationUtils.animateUpwards(15, 3),
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

    function blank() {
      const canvas = canvasRef.current;

      canvas.blank();

      setGrid(canvas.points);
    }

    return {
      grid,
      internal: canvasRef.current,
      drawBidwar,
      drawTarget,
      drawBinaryBidwar,
      drawDonationCTA,
      blank,
    }
  }, [grid])
}
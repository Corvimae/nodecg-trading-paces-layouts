export class BitmapCanvas {
  height: number;
  width: number;
  points: boolean[];

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.points = [...Array(height * width)];
  }
  
  coordsToOffset(x: number, y: number) {
    return (y * this.width) + x;
  }

  drawPoint(x: number, y: number) {
    this.points[this.coordsToOffset(x, y)] = true;
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = Math.sign(x2 - x1);
    const sy = Math.sign(y2 - y1);
    let err = dx - dy;
    
    while (true) {
      this.drawPoint(x1, y1);

      if (x1 === x2 && y1 === y2) break;
      
      const err2 = 2 * err;

      if (err2 > -dy) {
        err -= dy;
        x1 += sx;
      }

      if (err2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  drawFilledRect(x1: number, y1: number, x2: number, y2: number) {
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    
    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
        this.drawPoint(x, y);
      }
    }
  }
}
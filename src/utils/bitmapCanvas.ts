import { BitmapLetters } from "./bitmapLetters";

interface DrawOpts {
  inverse?: boolean;
}

type DrawStringOpts = DrawOpts & {
  letterSpacing?: number;
}

export class BitmapCanvas {
  height: number;
  width: number;
  points: boolean[];

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.points = [...Array(height * width)];
  }
  
  blank() {
    this.points = [...Array(this.height * this.width)];
  }

  coordsToOffset(x: number, y: number) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) return null;
    return (y * this.width) + x;
  }

  drawPoint(x: number, y: number, opts: DrawOpts = {}) {
    const drawInverse = opts.inverse ?? false;

    const offset = this.coordsToOffset(x, y);

    if (!offset) return;

    this.points[offset] = !drawInverse;
  }

  getPoint(x: number, y: number) {
    const offset = this.coordsToOffset(x, y);

    if (!offset) return false;

    return this.points[offset];
  }

  drawLetter(char: string, x: number, y: number, opts: DrawOpts = {}) {
    const charBitmap = BitmapLetters[char];

    if (!charBitmap) {
      this.drawOutlineRect(x, y, x + 4, y + 6);

      return [x + 5, x + 6];
    }
    
    for (let dy = 0; dy < charBitmap.length; dy += 1) {
      for (let dx = 0; dx < charBitmap[0].length; dx += 1) {
        if(charBitmap[dy][dx]) this.drawPoint(x + dx, y + dy, opts)
      }
    }

    return [x + charBitmap[0].length, y + charBitmap[0].length];
  }

  getStringWidth(value: string, letterSpacing = 1) {
    let dx = 0;

    for (const char of value) {
      if (dx !== 0) dx += letterSpacing;

      if (char === ' ') {
        dx += 3;
      } else {
        const charBitmap = BitmapLetters[char];

        if (charBitmap) {
          dx += charBitmap[0].length;
        } else {
          dx += 5;
        }
      }
    }

    return dx;
  }

  drawString(value: string, x: number, y: number, opts: DrawStringOpts = {}) {
    const letterSpacing = opts.letterSpacing ?? 1;
    let dx = x;

    for (const char of value) {
      if (char === ' ') {
        dx += letterSpacing + 3;
      } else {
        const [charX] = this.drawLetter(char, dx, y, opts);

        dx = charX + letterSpacing;
      }
    }
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
  
  drawRect(x1: number, y1: number, x2: number, y2: number, filled: boolean) {
    if (filled) {
      this.drawFilledRect(x1, y1, x2, y2);
    } else {
      this.drawOutlineRect(x1, y1, x2, y2);
    }
  }
  
  drawOutlineRect(x1: number, y1: number, x2: number, y2: number) {
    this.drawLine(x1, y1, x2, y1);
    this.drawLine(x2, y1, x2, y2);
    this.drawLine(x2, y2, x1, y2);
    this.drawLine(x1, y2, x1, y1);
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
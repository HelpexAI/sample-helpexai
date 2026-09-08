/**
 * Self-contained, zero-dependency QR Code Generator in pure TypeScript.
 * Implements ISO/IEC 18004 for QR Code symbols.
 */

export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export class QrSegment {
  readonly mode: number;
  readonly numChars: number;
  readonly bitData: number[];

  constructor(mode: number, numChars: number, bitData: number[]) {
    this.mode = mode;
    this.numChars = numChars;
    this.bitData = bitData;
  }

  static makeBytes(data: Uint8Array): QrSegment {
    const bb: number[] = [];
    for (let i = 0; i < data.length; i++) {
      appendBits(data[i], 8, bb);
    }
    return new QrSegment(0x4, data.length, bb);
  }

  static makeText(text: string): QrSegment {
    const enc = new TextEncoder();
    return QrSegment.makeBytes(enc.encode(text));
  }

  static getTotalBits(segs: readonly QrSegment[], version: number): number {
    let result = 0;
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      const ccbits = QrSegment.numCharCountBits(seg.mode, version);
      result += 4 + ccbits + seg.bitData.length;
    }
    return result;
  }

  static numCharCountBits(mode: number, version: number): number {
    const i = Math.floor((version + 7) / 17);
    switch (mode) {
      case 0x1: return [10, 12, 14][i]; // Numeric
      case 0x2: return [9, 11, 13][i];  // Alphanumeric
      case 0x4: return [8, 16, 16][i];  // Byte
      case 0x8: return [8, 10, 12][i];  // Kanji
      default: throw new RangeError("Invalid mode");
    }
  }
}

export class QrCode {
  readonly version: number;
  readonly size: number;
  readonly errorCorrectionLevel: QrErrorCorrectionLevel;
  readonly mask: number;
  private readonly modules: boolean[][];
  private readonly isFunction: boolean[][];

  constructor(
    version: number,
    ecl: QrErrorCorrectionLevel,
    dataCodewords: Uint8Array,
    mask: number
  ) {
    if (version < 1 || version > 40) throw new RangeError("Version value out of range");
    if (mask < -1 || mask > 7) throw new RangeError("Mask value out of range");
    this.version = version;
    this.size = version * 4 + 17;
    this.errorCorrectionLevel = ecl;

    // Initialize module grids
    this.modules = [];
    this.isFunction = [];
    for (let y = 0; y < this.size; y++) {
      this.modules.push(new Array(this.size).fill(false));
      this.isFunction.push(new Array(this.size).fill(false));
    }

    // Draw function patterns
    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);

    // If mask == -1, evaluate best mask, else apply specified
    if (mask === -1) {
      let minPenalty = 1e9;
      let bestMask = 0;
      for (let m = 0; m < 8; m++) {
        this.applyMask(m);
        this.drawFormatBits(m);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          minPenalty = penalty;
          bestMask = m;
        }
        this.applyMask(m); // unapply
      }
      mask = bestMask;
    }
    this.applyMask(mask);
    this.drawFormatBits(mask);
    this.mask = mask;
  }

  getModule(x: number, y: number): boolean {
    if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
      return this.modules[y][x];
    }
    return false;
  }

  static encodeText(text: string, ecl: QrErrorCorrectionLevel = "M"): QrCode {
    const segs = [QrSegment.makeText(text)];
    return QrCode.encodeSegments(segs, ecl);
  }

  static encodeSegments(
    segs: readonly QrSegment[],
    ecl: QrErrorCorrectionLevel,
    minVersion = 1,
    maxVersion = 40,
    mask = -1
  ): QrCode {
    for (let version = minVersion; ; version++) {
      const dataCap = QrCode.getNumDataCodewords(version, ecl) * 8;
      const dataUsed = QrSegment.getTotalBits(segs, version);
      if (dataUsed <= dataCap) {
        const bb: number[] = [];
        for (let s = 0; s < segs.length; s++) {
          const seg = segs[s];
          appendBits(seg.mode, 4, bb);
          appendBits(seg.numChars, QrSegment.numCharCountBits(seg.mode, version), bb);
          for (let b = 0; b < seg.bitData.length; b++) bb.push(seg.bitData[b]);
        }
        // Terminator
        const padLen = Math.min(4, dataCap - bb.length);
        appendBits(0, padLen, bb);
        appendBits(0, (8 - (bb.length % 8)) % 8, bb);
        for (let padByte = 0xec; bb.length < dataCap; padByte ^= 0xec ^ 0x11) {
          appendBits(padByte, 8, bb);
        }
        const dataBytes = new Uint8Array(bb.length / 8);
        for (let i = 0; i < bb.length; i += 8) {
          let b = 0;
          for (let j = 0; j < 8; j++) b = (b << 1) | bb[i + j];
          dataBytes[i / 8] = b;
        }
        return new QrCode(version, ecl, dataBytes, mask);
      }
      if (version >= maxVersion) throw new Error("Data too long for QR Code");
    }
  }

  private drawFunctionPatterns(): void {
    // Horizontal and vertical timing patterns
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }

    // 3 Finder patterns
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);

    // Alignment patterns
    const alignPatPos = QrCode.getAlignmentPatternPositions(this.version);
    const numAlign = alignPatPos.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === numAlign - 1) ||
          (i === numAlign - 1 && j === 0)
        ) {
          continue;
        }
        this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
      }
    }

    // Format bits dummy reservation
    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const px = x + dx;
        const py = y + dy;
        if (px >= 0 && px < this.size && py >= 0 && py < this.size) {
          this.setFunctionModule(px, py, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private drawFormatBits(mask: number): void {
    let data = (QrCode.getFormatBits(this.errorCorrectionLevel) << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    }
    const bits = ((data << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, getBit(bits, i));
    this.setFunctionModule(8, 7, getBit(bits, 6));
    this.setFunctionModule(8, 8, getBit(bits, 7));
    this.setFunctionModule(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, getBit(bits, i));

    for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
    this.setFunctionModule(8, this.size - 8, true);
  }

  private drawVersion(): void {
    if (this.version < 7) return;
    let rem = this.version;
    for (let i = 0; i < 12; i++) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    }
    const bits = (this.version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = getBit(bits, i);
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, bit);
      this.setFunctionModule(b, a, bit);
    }
  }

  private drawCodewords(data: Uint8Array): void {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
      }
    }
  }

  private applyMask(mask: number): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isFunction[y][x]) continue;
        let invert: boolean;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          default: throw new Error("Invalid mask");
        }
        if (invert) this.modules[y][x] = !this.modules[y][x];
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0;
    // Row/col runs
    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runVal = 0;
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] === runColor) {
          runVal++;
          if (runVal === 5) result += 3;
          else if (runVal > 5) result++;
        } else {
          runColor = this.modules[y][x];
          runVal = 1;
        }
      }
    }
    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runVal = 0;
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] === runColor) {
          runVal++;
          if (runVal === 5) result += 3;
          else if (runVal > 5) result++;
        } else {
          runColor = this.modules[y][x];
          runVal = 1;
        }
      }
    }
    // 2x2 blocks
    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const c = this.modules[y][x];
        if (
          c === this.modules[y][x + 1] &&
          c === this.modules[y + 1][x] &&
          c === this.modules[y + 1][x + 1]
        ) {
          result += 3;
        }
      }
    }
    return result;
  }

  private addEccAndInterleave(data: Uint8Array): Uint8Array {
    const numBlocks = QrCode.NUM_ERROR_CORRECTION_BLOCKS[this.errorCorrectionLevel][this.version];
    const blockEccLen = QrCode.ECC_CODEWORDS_PER_BLOCK[this.errorCorrectionLevel][this.version];
    const rawCodewords = Math.floor(QrCode.getNumRawDataModules(this.version) / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const blocks: Uint8Array[] = [];
    const rs = new ReedSolomonGenerator(blockEccLen);
    let k = 0;
    for (let i = 0; i < numBlocks; i++) {
      const dataLen = shortBlockLen - blockEccLen + (i >= numShortBlocks ? 1 : 0);
      const blockData = new Uint8Array(dataLen);
      blockData.set(data.subarray(k, k + dataLen));
      k += dataLen;
      const ecc = rs.getRemainder(blockData);
      const fullBlock = new Uint8Array(blockData.length + ecc.length);
      fullBlock.set(blockData);
      fullBlock.set(ecc, blockData.length);
      blocks.push(fullBlock);
    }

    const result = new Uint8Array(rawCodewords);
    let p = 0;
    let maxLen = 0;
    for (let b = 0; b < blocks.length; b++) {
      if (blocks[b].length > maxLen) maxLen = blocks[b].length;
    }
    for (let i = 0; i < maxLen; i++) {
      for (let j = 0; j < numBlocks; j++) {
        if (i < blocks[j].length) {
          result[p++] = blocks[j][i];
        }
      }
    }
    return result;
  }

  static getFormatBits(ecl: QrErrorCorrectionLevel): number {
    switch (ecl) {
      case "L": return 1;
      case "M": return 0;
      case "Q": return 3;
      case "H": return 2;
    }
  }

  static getNumDataCodewords(ver: number, ecl: QrErrorCorrectionLevel): number {
    return (
      Math.floor(QrCode.getNumRawDataModules(ver) / 8) -
      QrCode.ECC_CODEWORDS_PER_BLOCK[ecl][ver] *
      QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl][ver]
    );
  }

  static getNumRawDataModules(ver: number): number {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const numAlign = Math.floor(ver / 7) + 2;
      result -= (25 * numAlign - 10) * numAlign - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }

  static getAlignmentPatternPositions(ver: number): number[] {
    if (ver === 1) return [];
    const numAlign = Math.floor(ver / 7) + 2;
    const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result = [6];
    for (let pos = ver * 4 + 10; result.length < numAlign; pos -= step) {
      result.splice(1, 0, pos);
    }
    return result;
  }

  private static readonly ECC_CODEWORDS_PER_BLOCK: Record<QrErrorCorrectionLevel, number[]> = {
    L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  };

  private static readonly NUM_ERROR_CORRECTION_BLOCKS: Record<QrErrorCorrectionLevel, number[]> = {
    L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 72, 74, 77],
  };
}

class ReedSolomonGenerator {
  private readonly coefficients: Uint8Array;

  constructor(degree: number) {
    if (degree < 1 || degree > 255) throw new RangeError("Degree out of range");
    this.coefficients = new Uint8Array(degree);
    this.coefficients[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        this.coefficients[j] = ReedSolomonGenerator.multiply(this.coefficients[j], root);
        if (j + 1 < degree) {
          this.coefficients[j] ^= this.coefficients[j + 1];
        }
      }
      root = ReedSolomonGenerator.multiply(root, 0x02);
    }
  }

  getRemainder(data: Uint8Array): Uint8Array {
    const res = new Uint8Array(this.coefficients.length);
    for (let idx = 0; idx < data.length; idx++) {
      const b = data[idx];
      const factor = b ^ res[0];
      res.copyWithin(0, 1);
      res[res.length - 1] = 0;
      for (let i = 0; i < this.coefficients.length; i++) {
        res[i] ^= ReedSolomonGenerator.multiply(this.coefficients[i], factor);
      }
    }
    return res;
  }

  private static multiply(x: number, y: number): number {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
}

function appendBits(val: number, len: number, bb: number[]): void {
  for (let i = len - 1; i >= 0; i--) {
    bb.push((val >>> i) & 1);
  }
}

function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

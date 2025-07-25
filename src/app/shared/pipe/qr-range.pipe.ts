import { inject, Pipe, PipeTransform } from '@angular/core';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';

@Pipe({
  name: 'qrRange',
})
export class QrRangePipe implements PipeTransform {
  private readonly toHex = inject(ToHexPipe);

  public transform(from: unknown, to: unknown): string {
    if (!this.isValidNumber(from) || !this.isValidNumber(to)) {
      return '';
    }

    const fromNum = Number(from);
    const toNum = Number(to);

    const digits = toNum - fromNum - 1;
    const symbols = this.toHex.transform(digits).length;
    return `(${this.toHex.transform(to).substring(0, String(this.toHex.transform(to)).length - symbols) + 'X'.repeat(symbols)})`;
  }

  private isValidNumber(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return !isNaN(Number(value)) && !isNaN(parseFloat(value));
    }
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }
}

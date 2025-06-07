import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toHex',
})
export class ToHexPipe implements PipeTransform {
  public transform(value: unknown): string {
    try {
      const num = Number(value);
      if (isNaN(num)) {
        return '';
      }
      return num.toString(16).toUpperCase();
    } catch (e) {
      return '';
    }
  }
}

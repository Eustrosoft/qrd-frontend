import { Pipe, PipeTransform } from '@angular/core';
import { SizeUnitsLocalization } from '@shared/shared.constants';

@Pipe({
  name: 'bytesToSize',
})
export class BytesToSizePipe implements PipeTransform {
  public transform(bytes: unknown, decimals = 2): string {
    const num = Number(bytes);
    if (num === 0 || isNaN(num)) {
      return `0 ${SizeUnitsLocalization.b}`;
    }
    const k = 1024;
    const sizes = Object.values<string>(SizeUnitsLocalization);
    const i = Math.floor(Math.log(num) / Math.log(k));
    const size = parseFloat((num / Math.pow(k, i)).toFixed(decimals));
    return `${size} ${sizes[i]}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { SizeUnitsLocalization } from '@shared/shared.constants';

@Pipe({
  name: 'bytesToSize',
})
export class BytesToSizePipe implements PipeTransform {
  public transform(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return `0 ${SizeUnitsLocalization.b}`;
    }
    const k = 1024;
    const sizes = Object.values<string>(SizeUnitsLocalization);
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    return `${size} ${sizes[i]}`;
  }
}

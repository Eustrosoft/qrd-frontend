import { Pipe, PipeTransform } from '@angular/core';

export const MaskChar = '•';

@Pipe({
  name: 'masked',
})
export class MaskedPipe implements PipeTransform {
  public transform(value: string | null | undefined, isRevealed?: boolean): string {
    if (!value) {
      return '';
    }

    if (isRevealed) {
      return value;
    }

    return MaskChar.repeat(value.length);
  }
}

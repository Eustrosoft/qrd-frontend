import { Pipe, PipeTransform } from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';

@Pipe({
  name: 'boolToText',
})
export class BoolToTextPipe implements PipeTransform {
  public transform(
    value: unknown,
    trueText: string = SharedLocalization.yes,
    falseText: string = SharedLocalization.no,
  ): string {
    if (value === null || value === undefined) {
      return SharedLocalization.unknown;
    }

    const boolValue = Boolean(value);
    return boolValue ? trueText : falseText;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',
})
export class FallbackPipe implements PipeTransform {
  public transform(value: unknown, fallback: string = '', checkWhitespace: boolean = true): string {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === 'string') {
      const isEmptyString = value === '';
      const isWhitespaceOnly = checkWhitespace && /^\s*$/.test(value);

      if (isEmptyString || isWhitespaceOnly) {
        return fallback;
      }
    }

    return <string>value;
  }
}

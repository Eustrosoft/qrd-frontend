import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',
})
export class FallbackPipe implements PipeTransform {
  public transform(value: unknown, fallback: string = '', checkWhitespace: boolean = true): string {
    // Check for null or undefined
    if (value === null || value === undefined) {
      return fallback;
    }

    // Check for empty string or whitespace-only string (if enabled)
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

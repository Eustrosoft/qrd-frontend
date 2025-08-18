import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iso8601DateFormat',
  standalone: true,
})
export class Iso8601DateFormatPipe implements PipeTransform {
  public transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) return '';

    // Directly format as YYYY-MM-DD (no timezone manipulation)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

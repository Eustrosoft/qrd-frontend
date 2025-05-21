import { Pipe, PipeTransform } from '@angular/core';

/**
 * Пытается разобрать строку или число и преобразовать в дату в русской локализации
 * Например: преобразовать строку '01.02.2000' в объект Date (Tue Feb 01 2000 00:00:00 GMT+0300)
 *
 * @param {unknown} value - Данные введенные пользователем вручную в input даты
 * @returns {Date | null} - Объект даты, в случае успешной конвертации, null в обратном случае
 */
@Pipe({
  name: 'ruDateAdapterParse',
  standalone: true,
})
export class RuDateAdapterParsePipe implements PipeTransform {
  public transform(value: unknown): Date | null {
    if (typeof value === 'string' && value.indexOf('.') > -1) {
      const str = value.split('.');
      const year = parseInt(str[2], 10);
      const month = parseInt(str[1], 10) - 1;
      const date = parseInt(str[0], 10);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(String(value));
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}

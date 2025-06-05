import { inject, Pipe, PipeTransform } from '@angular/core';
import { DOCUMENT_FONT_SIZE } from '@cdk/tokens/document-font-size.token';
import { NO_LEADING_ZERO_INTEGER_REGEXP } from '@shared/validators/validators.constants';

/**
 * Конвертирует px в rem
 * Принимает только те значения, которые пройдут проверку POSITIVE_INTEGER_REGEXP
 * Если проверка не пройдено - вернет исходное значение
 *
 * @param {string} value - Строка с числом размера в px
 * @returns {string} - Значение в rem, округленное до сотых
 */
@Pipe({
  name: 'pxToRem',
  standalone: true,
})
export class PxToRemPipe implements PipeTransform {
  private readonly documentFontSize: number = inject(DOCUMENT_FONT_SIZE);

  public transform(value: string): string {
    if (!NO_LEADING_ZERO_INTEGER_REGEXP.test(value)) {
      return value;
    }

    const number = Number(value);

    if (isNaN(number)) {
      throw new Error(
        `Value "${value}" is incorrect in PxToRemPipe. Provide correct value: numeric string with percent like "100%" or numeric string like "50"`,
      );
    }

    if (isNaN(this.documentFontSize)) {
      throw new Error('font-size property must be explicitly defined on HTMLElement');
    }

    const convertedValue = number / this.documentFontSize;

    const roundedValue = Math.round(convertedValue * 100) / 100;

    return `${roundedValue}rem`;
  }
}

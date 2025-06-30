import { Pipe, PipeTransform } from '@angular/core';

/**
 * Разбирает значение заголовка Content-Disposition для указания наименования и расширения файла при скачивании
 *
 * @param {string | null} value - Значение заголовка Content-Disposition
 * @param {string} fallbackFilename - Имя файла по умолчанию
 * @param {string} fallbackExtension - Расширение файла по умолчанию
 * @returns {string} - Имя файла с расширением
 */
@Pipe({
  name: 'contentDispositionHeaderParse',
  standalone: true,
})
export class ContentDispositionHeaderParsePipe implements PipeTransform {
  public transform(
    value: string | null,
    fallbackFilename: string = 'filename',
    fallbackExtension: string = 'pdf',
  ): string {
    if (!value) {
      return this.formatFilename(fallbackFilename, fallbackExtension);
    }

    const utf8Filename = this.extractRFC5987Filename(value);
    if (utf8Filename) {
      return utf8Filename;
    }

    const filename = this.extractStandardFilename(value);
    if (filename) {
      return filename;
    }

    return this.formatFilename(fallbackFilename, fallbackExtension);
  }

  private extractRFC5987Filename(header: string): string | null {
    const rfc5987Regex = /filename\*=(?:UTF-8'')?([^;\n]*)/i;
    const matches = header.match(rfc5987Regex);

    if (matches?.[1]) {
      try {
        return decodeURIComponent(matches[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }

  private extractStandardFilename(header: string): string | null {
    const standardRegex = /filename[^;=\n]*=(["']?)([^"'\n;]+)\1/i;
    const matches = header.match(standardRegex);

    if (matches?.[2]) {
      return matches[2].replace(/['"]/g, '').trim();
    }
    return null;
  }

  private formatFilename(name: string, ext: string): string {
    const baseName = name.replace(new RegExp(`\\.${ext}$`, 'i'), '');
    return `${baseName}.${ext.toLowerCase()}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textAvatar',
  standalone: true,
})
export class TextAvatarPipe implements PipeTransform {
  /**
   * Возвращает первые 2 буквы каждого элемента массива строк parts
   * В случае если предоставлена целостная строка - первые 2 буквы этой строки
   * @param value - строка разделенная пробелами, например: "Иванов Иван Иванович" или целостная строка, например: "Иванов"
   * @param separator - разделитель строки
   * @param fallback - значение, которое будет возвращено если невозможно получить данные из строки
   */
  public transform(value: string, separator = ' ', fallback = 'AA'): string {
    const parts = value.trim().split(separator);

    // Если только одно слово и есть 2 буквы
    if (parts.length === 1 && parts[0].length >= 2) {
      return `${parts[0].charAt(0).toUpperCase()}${parts[0].charAt(1).toUpperCase()}`;
    }

    if (parts.length < 2) {
      return fallback;
    }

    return `${parts[0].charAt(0).toUpperCase()}${parts[1].charAt(0).toUpperCase()}`;
  }
}

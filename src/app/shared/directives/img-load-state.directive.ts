import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[imgLoadState]',
  exportAs: 'imgLoadState',
})
export class ImgLoadStateDirective {
  public isLoaded = false;
  private isErrorHandled = false;

  @HostListener('load')
  public onLoad(): void {
    this.isLoaded = true;
  }

  @HostListener('error', ['$event'])
  public onError(event: Event): void {
    if (this.isErrorHandled) return;
    this.isErrorHandled = true;

    this.isLoaded = true;
    const imgElement = <HTMLImageElement>event.target;
    imgElement.onerror = null;
    imgElement.src =
      // eslint-disable-next-line max-len
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UxZTJlNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NjYiPkNhbid0IGxvYWQgUVI8L3RleHQ+Cjwvc3ZnPg==';
  }
}

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[imgLoadState]',
  exportAs: 'imgLoadState',
})
export class ImgLoadStateDirective {
  public isLoaded = false;

  @HostListener('load')
  public onLoad(): void {
    this.isLoaded = true;
  }

  @HostListener('error', ['$event'])
  public onError(event: Event): void {
    (<HTMLImageElement>event.target).src = 'public/icons/fallback-qr-img.svg';
  }
}

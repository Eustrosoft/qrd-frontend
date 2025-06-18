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
}

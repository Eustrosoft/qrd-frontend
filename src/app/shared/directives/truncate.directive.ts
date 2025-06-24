import { AfterViewInit, Directive, ElementRef, HostListener, inject, input, model } from '@angular/core';

@Directive({
  selector: '[truncate]',
  host: {
    '[style.max-width]': 'maxWidth()',
    '[style.text-overflow]': '"ellipsis"',
    '[style.overflow]': '"hidden"',
    '[style.white-space]': '"nowrap"',
  },
})
export class TruncateDirective implements AfterViewInit {
  private readonly elRef = inject(ElementRef);
  public readonly truncate = input<HTMLElement>(this.elRef.nativeElement);
  protected readonly maxWidth = model<string>('320px');
  protected readonly widthToExtract = input<number>(22);

  public ngAfterViewInit(): void {
    this.doTruncate();
  }

  @HostListener('window:resize')
  private onWindowResize(): void {
    this.doTruncate();
  }

  private doTruncate(): void {
    this.maxWidth.set(`${this.truncate().clientWidth - this.widthToExtract()}px`);
  }
}

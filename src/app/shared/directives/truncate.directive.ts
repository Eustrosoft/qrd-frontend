import { AfterViewInit, Directive, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';

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

  protected readonly maxWidth = signal<string>('320px');

  public readonly host = model<HTMLElement>(this.elRef.nativeElement);
  public readonly widthToExtract = input<number>(22);

  public ngAfterViewInit(): void {
    this.doTruncate();
  }

  @HostListener('window:resize')
  private onWindowResize(): void {
    this.doTruncate();
  }

  private doTruncate(): void {
    this.maxWidth.set(`${this.host().clientWidth - this.widthToExtract()}px`);
  }
}

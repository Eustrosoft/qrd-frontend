import { AfterViewInit, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ellipsis]',
  standalone: true,
})
export class EllipsisDirective implements AfterViewInit {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  public ngAfterViewInit(): void {
    this.setStyle();
  }

  private setStyle(): void {
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
    this.renderer.setStyle(this.el.nativeElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.el.nativeElement, 'text-overflow', 'ellipsis');
  }
}

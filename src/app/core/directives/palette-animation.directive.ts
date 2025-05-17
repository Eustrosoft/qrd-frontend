import { AfterViewInit, Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[paletteAnimation]',
})
export class PaletteAnimationDirective implements AfterViewInit {
  private readonly elRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private circles: SVGCircleElement[] = [];

  public ngAfterViewInit(): void {
    this.waitForIconLoad();
  }

  private waitForIconLoad(): void {
    const checkInterval = setInterval(() => {
      const svg = this.elRef.nativeElement.querySelector('ui-icon svg');
      if (svg) {
        clearInterval(checkInterval);
        this.initCircles(svg);
      }
    }, 50);
  }

  private initCircles(svg: SVGSVGElement): void {
    this.circles = Array.from(svg.querySelectorAll('circle'));

    this.circles.forEach((circle) => {
      this.renderer.setStyle(circle, 'opacity', '0');
      this.renderer.setStyle(circle, 'transition', 'opacity 0.4s ease, fill 0.4s ease, transform 0.4s ease');
      this.renderer.setStyle(circle, 'transform-origin', 'center');
      this.renderer.setStyle(circle, 'transform-box', 'border-box');
    });
  }

  @HostListener('mouseenter')
  private onMouseEnter(): void {
    this.animateCirclesOnHover();
  }

  @HostListener('mouseleave')
  private onMouseLeave(): void {
    this.animateCirclesOnLeave();
  }

  private animateCirclesOnHover(): void {
    const colors = [
      'var(--mat-sys-error, red)',
      'var(--mat-extended-success-color, green)',
      'var(--mat-sys-secondary, blue)',
      'var(--mat-sys-tertiary-container, lightblue)',
    ];

    this.circles.forEach((circle, index) => {
      this.renderer.setStyle(circle, 'fill', colors[index]);
      this.renderer.setStyle(circle, 'transition-delay', `${0.1 * (index + 1)}s`);
      this.renderer.setStyle(circle, 'opacity', '1');
      this.renderer.setStyle(circle, 'transform', 'scale(1.3)');
    });
  }

  private animateCirclesOnLeave(): void {
    this.circles.forEach((circle, index) => {
      const delay = 0.1 * (this.circles.length - index);
      this.renderer.setStyle(circle, 'transition-delay', `${delay}s`);
      this.renderer.setStyle(circle, 'opacity', '0');
      this.renderer.setStyle(circle, 'fill', 'transparent');
      this.renderer.setStyle(circle, 'transform', 'scale(1)');
    });
  }
}

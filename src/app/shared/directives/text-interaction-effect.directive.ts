import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[textInteractionEffect]',
})
export class TextInteractionEffect {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.setHoverState();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.resetState();
  }

  @HostListener('focus')
  public onFocus(): void {
    this.setFocusState();
  }

  @HostListener('blur')
  public onBlur(): void {
    this.resetState();
  }

  @HostListener('mousedown')
  public onMouseDown(): void {
    this.setPressedState();
  }

  @HostListener('mouseup')
  public onMouseUp(): void {
    this.setHoverState();
  }

  private setHoverState(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'color',
      'color-mix(in srgb,  var(--mat-sys-primary-container) 15%, var(--mat-sys-primary))',
    );
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'color 120ms cubic-bezier(0.4, 0, 0.2, 1)');
  }

  private setFocusState(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'color',
      'color-mix(in srgb,  var(--mat-sys-on-surface) 12%, var(--mat-sys-primary))',
    );
  }

  private setPressedState(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'color',
      'color-mix(in srgb,  var(--mat-sys-on-surface) 16%, var(--mat-sys-primary))',
    );
  }

  private resetState(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'color');
  }
}

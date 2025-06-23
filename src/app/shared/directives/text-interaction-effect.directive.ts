import { Directive, ElementRef, HostListener, inject, model, Renderer2 } from '@angular/core';

@Directive({
  selector: '[interactionEffect]',
})
export class InteractionEffect {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  public readonly targetSelectors = model<string[]>([':host']);

  private getTargetElements(): HTMLElement[] {
    if (this.targetSelectors().length === 0) {
      return [this.el.nativeElement];
    }

    return this.targetSelectors().flatMap((selector) => {
      if (selector === ':host') {
        return [this.el.nativeElement];
      }
      return Array.from(this.el.nativeElement.querySelectorAll(selector));
    });
  }

  private applyToTargets(callback: (element: HTMLElement) => void): void {
    const targets = this.getTargetElements();
    targets.forEach((element) => callback(element));
  }

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
    this.applyToTargets((element) => {
      this.renderer.setStyle(
        element,
        'color',
        'color-mix(in srgb,  var(--mat-sys-primary-container) 15%, var(--mat-sys-primary))',
      );
      this.renderer.setStyle(element, 'transition', 'color 120ms cubic-bezier(0.4, 0, 0.2, 1)');
    });
  }

  private setFocusState(): void {
    this.applyToTargets((element) => {
      this.renderer.setStyle(
        element,
        'color',
        'color-mix(in srgb,  var(--mat-sys-on-surface) 12%, var(--mat-sys-primary))',
      );
    });
  }

  private setPressedState(): void {
    this.applyToTargets((element) => {
      this.renderer.setStyle(
        element,
        'color',
        'color-mix(in srgb,  var(--mat-sys-on-surface) 16%, var(--mat-sys-primary))',
      );
    });
  }

  private resetState(): void {
    this.applyToTargets((element) => {
      this.renderer.removeStyle(element, 'color');
    });
  }
}

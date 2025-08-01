import { Directive, effect, ElementRef, HostBinding, inject, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[overlayAnimation]',
})
export class OverlayAnimationDirective implements OnDestroy {
  public readonly isOpen = input<boolean>(false);
  public readonly animationDone = output<void>();

  @HostBinding('class.is-open') get isOpenClass(): boolean {
    return this.isOpen();
  }

  private readonly nativeElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly onAnimationEnd: (event: AnimationEvent) => void = () => {
    if (!this.isOpen()) {
      this.animationDone.emit();
    }
  };

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.nativeElement.addEventListener('animationend', this.onAnimationEnd, {
          once: true,
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.nativeElement.removeEventListener('animationend', this.onAnimationEnd);
  }
}

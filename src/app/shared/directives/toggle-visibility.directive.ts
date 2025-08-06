import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Directive({
  selector: '[toggleVisibility]',
  standalone: true,
  exportAs: 'toggleVisibility',
})
export class ToggleVisibilityDirective {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private currentAnimation: Animation | null = null;

  public readonly toggleVisibility = input<boolean>(false);

  constructor() {
    const el = this.elRef.nativeElement;
    const initialVisible = this.toggleVisibility();

    this.renderer.setStyle(el, 'opacity', initialVisible ? '1' : '0');
    this.renderer.setStyle(el, 'display', initialVisible ? 'inline-block' : 'none');

    toObservable(this.toggleVisibility)
      .pipe(tap({ next: (visible) => this.animateVisibility(visible) }), takeUntilDestroyed())
      .subscribe();
  }

  private animateVisibility(visible: boolean): void {
    const el = this.elRef.nativeElement;

    this.currentAnimation?.cancel();

    if (visible) {
      this.renderer.setStyle(el, 'display', 'inline-block');
    }

    this.currentAnimation = el.animate([{ opacity: visible ? 0 : 1 }, { opacity: visible ? 1 : 0 }], {
      duration: 300,
      fill: 'forwards',
      easing: 'ease',
    });

    this.currentAnimation!.onfinish = (): void => {
      if (!visible) {
        this.renderer.setStyle(el, 'display', 'none');
      }
      this.currentAnimation = null;
    };
  }
}

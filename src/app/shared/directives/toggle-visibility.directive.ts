import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Directive({
  selector: '[toggleVisibility]',
  standalone: true,
  exportAs: 'toggleVisibility',
})
export class ToggleVisibilityDirective {
  private readonly elRef = inject(ElementRef);
  private readonly animationBuilder = inject(AnimationBuilder);
  private readonly renderer = inject(Renderer2);

  private player: AnimationPlayer | null = null;
  public readonly toggleVisibility = input<boolean>(false);

  constructor() {
    this.renderer.setStyle(this.elRef.nativeElement, 'opacity', this.toggleVisibility() ? '1' : '0');
    this.renderer.setStyle(this.elRef.nativeElement, 'display', this.toggleVisibility() ? 'inline-block' : 'none');

    toObservable(this.toggleVisibility)
      .pipe(
        tap((isVisible) => this.updateAnimation(isVisible)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private updateAnimation(isVisible: boolean): void {
    this.player?.destroy();

    // Перед анимацией показываем элемент (если нужно)
    if (isVisible) {
      this.renderer.setStyle(this.elRef.nativeElement, 'display', 'inline-block');
    }

    const animation = this.animationBuilder.build([
      style({ opacity: isVisible ? 0 : 1 }),
      animate('300ms', style({ opacity: isVisible ? 1 : 0 })),
    ]);

    this.player = animation.create(this.elRef.nativeElement);
    this.player.onDone(() => {
      if (!isVisible) {
        this.renderer.setStyle(this.elRef.nativeElement, 'display', 'none');
      }
    });
    this.player.play();
  }
}

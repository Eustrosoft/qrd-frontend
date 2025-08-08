import {
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[animatedIf]',
})
export class AnimatedIfDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  private viewRef: EmbeddedViewRef<unknown> | null = null;
  private isShowing = false;
  private animationEndListener: (() => void) | null = null;

  public readonly animatedIf = input.required<boolean>();

  private readonly animatedIfEff = effect(() => {
    const animatedIf = this.animatedIf();
    if (animatedIf && !this.isShowing) {
      this.show();
    } else if (!animatedIf && this.isShowing) {
      this.hide();
    }
  });

  private show(): void {
    this.viewRef = this.vcr.createEmbeddedView(this.templateRef);
    const el = this.getElement();
    if (!el) return;

    this.renderer.addClass(el, 'animate-enter');
    this.renderer.removeClass(el, 'animate-leave');
    this.isShowing = true;
  }

  private hide(): void {
    const el = this.getElement();
    if (!el) return;

    this.renderer.removeClass(el, 'animate-enter');
    this.renderer.addClass(el, 'animate-leave');
    this.isShowing = false;

    this.animationEndListener?.();

    this.animationEndListener = this.renderer.listen(el, 'animationend', () => {
      this.vcr.clear();
      this.animationEndListener?.();
      this.animationEndListener = null;
      this.isShowing = false;
    });
  }

  private getElement(): HTMLElement | null {
    return this.viewRef?.rootNodes?.[0] ?? null;
  }
}

import {
  afterNextRender,
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  runInInjectionContext,
} from '@angular/core';
import { DEFAULT_ITEMS_PER_PAGE } from '@app/app.constants';

@Directive({
  selector: '[scrolledToLast]',
})
export class ScrolledToLastDirective implements AfterViewInit, OnDestroy {
  private readonly injector = inject(Injector);

  public readonly count = input<number>();
  public readonly isListLoading = input<boolean>();
  public readonly isLast = output<void>();

  protected readonly intersectionObserverEffect = effect(() => {
    if (!this.count() || this.isListLoading()) {
      return;
    }
    runInInjectionContext(this.injector, () => {
      afterNextRender({
        write: () => {
          this.setupIntersectionObserver();
        },
      });
    });
  });

  private observer!: IntersectionObserver;
  private lastElement: HTMLElement | null = null;

  private readonly elRef = inject(ElementRef);

  public ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  public ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === this.lastElement) {
          this.isLast.emit();
        }
      });
    }, options);

    this.observeLastChild();
  }

  private observeLastChild(): void {
    if (this.lastElement) {
      this.observer.unobserve(this.lastElement);
    }

    const children = this.elRef.nativeElement.children;
    if (children.length > DEFAULT_ITEMS_PER_PAGE) {
      this.lastElement = children[children.length - 1] as HTMLElement;
      this.observer.observe(this.lastElement);
    }
  }
}

import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[scrolledToLast]',
})
export class ScrolledToLastDirective implements AfterViewInit, OnDestroy {
  public readonly isLast = output<void>();

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
    // Отключаем наблюдение за предыдущим последним элементом
    if (this.lastElement) {
      this.observer.unobserve(this.lastElement);
    }

    // Находим новый последний элемент
    const children = this.elRef.nativeElement.children;
    if (children.length > 0) {
      this.lastElement = children[children.length - 1] as HTMLElement;
      this.observer.observe(this.lastElement);
    }
  }

  // Метод для вызова из родительского компонента при изменении списка
  public updateLastItem(): void {
    this.observeLastChild();
  }
}

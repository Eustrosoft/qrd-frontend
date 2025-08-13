import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';
import { MatButton } from '@angular/material/button';
import { CollapsibleListDirective } from '@shared/directives/collapsible-list.directive';
import { animationFrameScheduler, first, of, scheduled } from 'rxjs';

@Component({
  selector: 'collapsible-container',
  imports: [MatButton],
  templateUrl: './collapsible-container.component.html',
  styleUrl: './collapsible-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleContainerComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  public readonly visibleItems = input<number>(3);
  public readonly showMoreText = input<string>(SharedLocalization.showMore);
  public readonly showLessText = input<string>(SharedLocalization.showLess);

  public readonly projectedList = contentChild.required(CollapsibleListDirective, { read: ElementRef });
  public readonly wrapper = viewChild.required('wrapper', { read: ElementRef });
  public readonly inner = viewChild.required('inner', { read: ElementRef });

  public readonly isCollapsed = signal(true);
  public readonly canToggle = signal(false);

  private resizeObserver!: ResizeObserver;
  protected disableTransition = signal(true);

  public ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(() => this.setHeight());
  }

  public ngAfterContentInit(): void {
    this.canToggle.set(this.projectedList().nativeElement.children.length > this.visibleItems());
    this.setHeight();
    this.resizeObserver.observe(this.inner().nativeElement);
  }

  public ngAfterViewInit(): void {
    scheduled(of(null), animationFrameScheduler)
      .pipe(first())
      .subscribe({
        next: () => {
          this.disableTransition.set(false);
        },
      });
  }

  public ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  protected toggleCollapse(): void {
    this.isCollapsed.update((value) => !value);
    this.setHeight();
  }

  private setHeight(): void {
    const children = Array.from<HTMLElement>(this.projectedList().nativeElement.children);

    if (!children.length) return;

    const wrapperEl = this.wrapper().nativeElement;
    const innerEl = this.inner().nativeElement;
    let targetHeight: number;

    if (!this.isCollapsed()) {
      targetHeight = innerEl.scrollHeight;
    } else {
      const slice = children.slice(0, this.visibleItems());
      const lastEl = slice[slice.length - 1];
      const rect = lastEl.getBoundingClientRect();
      const innerRect = innerEl.getBoundingClientRect();
      targetHeight = rect.bottom - innerRect.top;
    }
    wrapperEl.style.height = `${targetHeight}px`;
  }
}

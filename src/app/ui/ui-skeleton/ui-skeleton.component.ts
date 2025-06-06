import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PxToRemPipe } from '@app/shared/pipe/px-to-rem.pipe';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [],
  template: '<div class="skeleton-shimmer"></div>',
  styleUrl: './ui-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"block"',
    '[style.position]': '"relative"',
    '[style.overflow]': '"hidden"',
    '[style.background]': 'background()',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.border-radius]': 'borderRadius()',
  },
})
export class UiSkeletonComponent {
  private readonly pxToRemPipe: PxToRemPipe = inject(PxToRemPipe);

  public readonly width = input<string, string>('100%', {
    transform: (value) => this.pxToRemPipe.transform(value),
  });
  public readonly height = input<string, string>('100%', {
    transform: (value) => this.pxToRemPipe.transform(value),
  });
  public readonly borderRadius = input<string, string>('0.5rem', {
    transform: (value) => this.pxToRemPipe.transform(value),
  });
  public readonly background = input<string>('var(--mat-sys-tertiary-container)');
}

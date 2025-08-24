import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImgLoadStateDirective } from '@shared/directives/img-load-state.directive';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'qr-renderer',
  imports: [ImgLoadStateDirective, UiSkeletonComponent],
  templateUrl: './qr-renderer.component.html',
  styleUrl: './qr-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--img-width]': 'width()',
  },
})
export class QrRendererComponent {
  public readonly code = input.required<string>();
  public readonly width = input('128px');

  protected readonly srcUrl = computed(
    () =>
      `https://qrgen.qxyz.ru/generate?q=${this.code()}&amp;color=%23000000&amp;background=%23ffffff&amp;x=${this.width()}&amp;fileType=SVG&amp;correctionLevel=L`,
  );
}

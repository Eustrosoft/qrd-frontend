import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ImgLoadStateDirective } from '@shared/directives/img-load-state.directive';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { HttpParams } from '@angular/common/http';
import { AppState } from '@app/state/app.state';
import { select } from '@ngxs/store';
import { DefaultConfig } from '@shared/shared.constants';

@Component({
  selector: 'qr-renderer',
  imports: [ImgLoadStateDirective, UiSkeletonComponent],
  templateUrl: './qr-renderer.component.html',
  styleUrl: './qr-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--img-width]': 'remWidth()',
  },
})
export class QrRendererComponent {
  private readonly pxToRemPipe = inject(PxToRemPipe);

  public readonly code = input.required<string>();
  public readonly width = input<number>(128);

  protected readonly remWidth = computed(() => this.pxToRemPipe.transform(this.width().toString()));

  private readonly configState = select(AppState.getConfigState$);

  protected readonly srcUrl = computed(() => {
    const params = new HttpParams({
      fromObject: {
        q: this.code(),
        color: '#000000',
        background: '#ffffff',
        x: this.width(),
        fileType: 'SVG',
        correctionLevel: 'L',
      },
    });
    return `${this.configState().config.qrdConf?.qrgenUri ?? DefaultConfig.qrdConf?.qrgenUri}?${params.toString()}`;
  });
}

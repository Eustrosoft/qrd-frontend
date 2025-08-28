import { ChangeDetectionStrategy, Component, computed, contentChild, inject, input, signal } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'overlay-container',
  imports: [CdkConnectedOverlay],
  templateUrl: './overlay-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'overlayContainer',
})
export class OverlayContainerComponent {
  private readonly overlay = inject(Overlay);

  public readonly originX = input<ConnectedPosition['originX']>('end');
  public readonly overlayX = input<ConnectedPosition['overlayX']>('end');

  protected readonly trigger = contentChild.required(CdkOverlayOrigin);

  protected readonly overlayPositions = computed<ConnectedPosition[]>(() => [
    {
      originX: this.originX(),
      originY: 'bottom',
      overlayX: this.overlayX(),
      overlayY: 'top',
      offsetY: 24,
    },
  ]);

  public readonly isOverlayOpen = signal<boolean>(false);
  protected readonly isOverlayAttached = signal<boolean>(false);
  protected readonly overlayScrollStrategy = this.overlay.scrollStrategies.close();

  public openOverlay(): void {
    this.isOverlayAttached.set(true);
    this.isOverlayOpen.set(true);
  }

  protected closeOverlay(): void {
    this.isOverlayOpen.set(false);
  }

  public onOverlayClosed(): void {
    if (!this.isOverlayOpen()) {
      this.isOverlayAttached.set(false);
    }
  }

  protected detachOverlay(): void {
    this.isOverlayAttached.set(false);
  }
}

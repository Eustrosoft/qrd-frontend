import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'view-mode-settings',
  imports: [CdkConnectedOverlay, MatIcon, CdkOverlayOrigin, MatFabButton],
  templateUrl: './view-mode-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'vmSettings',
})
export class ViewModeSettingsComponent {
  private readonly overlay = inject(Overlay);

  protected readonly overlayPositions = computed<ConnectedPosition[]>(() => [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 24,
    },
  ]);

  public readonly isOverlayOpen = signal<boolean>(false);
  protected readonly isOverlayAttached = signal<boolean>(false);
  protected readonly overlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected openOverlay(): void {
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

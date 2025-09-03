import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SharedLocalization } from '@shared/shared.constants';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { MatButton } from '@angular/material/button';
import { UiAlertComponent } from '@ui/ui-alert/ui-alert.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';

@Component({
  selector: 'qr-view',
  imports: [MatProgressSpinner, MatButton, UiAlertComponent, UiGridBlockComponent],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrViewComponent {
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly domSanitizer = inject(DomSanitizer);

  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public readonly iframeSrc = input.required<string>();
  public readonly isPreviewingUnsaved = input<boolean>(false);

  protected readonly src = computed(() => this.domSanitizer.bypassSecurityTrustResourceUrl(this.iframeSrc()));
  protected isLoading: boolean = true;
  protected isLoadError: boolean = false;

  protected onIframeLoad(): void {
    this.isLoading = false;
    this.isLoadError = false;
  }

  protected onIframeError(): void {
    this.isLoading = false;
    this.isLoadError = true;
  }

  protected closeSidenav(): void {
    this.uiSidenavService.close();
  }
}

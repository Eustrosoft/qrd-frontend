import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SharedLocalization } from '@shared/shared.constants';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'qr-view',
  imports: [MatProgressSpinner, MatButton],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrViewComponent {
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly domSanitizer = inject(DomSanitizer);
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public readonly iframeSrc = input.required<string>();

  protected readonly src = computed(() => this.domSanitizer.bypassSecurityTrustResourceUrl(this.iframeSrc()));
  protected isLoading: boolean = true;
  protected isLoadError: boolean = false;

  protected onIframeLoad(): void {
    this.isLoading = false;
    this.isLoadError = true;
  }

  protected onIframeError(): void {
    this.isLoading = false;
    this.isLoadError = true;
  }

  protected closeSidenav(): void {
    this.uiSidenavService.close();
  }
}

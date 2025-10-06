import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationSnackbarLocalization } from '@modules/error/error.constants';

@Component({
  selector: 'network-status-banner',
  imports: [],
  templateUrl: './network-status-banner.component.html',
  styleUrl: './network-status-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkStatusBannerComponent {
  protected readonly NotificationSnackbarLocalization = NotificationSnackbarLocalization;
}

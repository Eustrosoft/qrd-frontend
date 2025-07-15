import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { NotificationSnackbarData } from '@shared/components/notification-snackbar/notification-snackbar.model';
import { MatIconButton } from '@angular/material/button';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';

@Component({
  selector: 'notification-snackbar',
  imports: [MatIcon, MatIconButton, UiGridBlockComponent],
  standalone: true,
  templateUrl: './notification-snackbar.component.html',
  styleUrl: './notification-snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSnackbarComponent {
  protected readonly data = inject<NotificationSnackbarData>(MAT_SNACK_BAR_DATA);
  protected readonly matSnackBarRef = inject<MatSnackBarRef<NotificationSnackbarComponent>>(
    MatSnackBarRef<NotificationSnackbarComponent>,
  );
}

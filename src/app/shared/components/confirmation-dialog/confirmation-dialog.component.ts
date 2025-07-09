import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { MatIcon } from '@angular/material/icon';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIcon, UiFlexBlockComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  protected readonly dialogData: ConfirmationDialogData = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
}

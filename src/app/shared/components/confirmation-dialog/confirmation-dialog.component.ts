import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { MatIcon } from '@angular/material/icon';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';

@Component({
  selector: 'confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIcon,
    UiFlexBlockComponent,
    MatIconButton,
    UiGridBlockComponent,
    MatFabButton,
    InteractionEffect,
    MatButton,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  protected readonly dialogData: ConfirmationDialogData = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
}

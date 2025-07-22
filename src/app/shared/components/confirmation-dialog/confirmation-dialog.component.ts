import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { MatIcon } from '@angular/material/icon';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { ConfirmationDialogLocalization } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';

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
    MatCheckbox,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly matDialogRef = inject<MatDialogRef<ConfirmationDialogData, boolean>>(MatDialogRef);

  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly dialogData = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
  protected readonly checkboxControl = this.fb.nonNullable.control(false, [
    this.dialogData.showConfirmationCheckbox ? Validators.requiredTrue : Validators.nullValidator,
  ]);

  protected readonly ConfirmationDialogLocalization = ConfirmationDialogLocalization;

  protected confirm(): void {
    this.checkboxControl.markAsTouched();
    if (this.checkboxControl.invalid) {
      return;
    }
    this.matDialogRef.close(true);
  }
}

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { TemplateCreationForm } from '@app/pages/templates/templates.models';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { TemplatesLocalization } from '@app/pages/templates/templates.constants';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { MatError } from '@angular/material/form-field';
import { CreateTemplate } from '@app/pages/templates/state/templates.actions';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { TemplatesSelectors } from '@app/pages/templates/state/templates.selectors';

@Component({
  selector: 'template-create',
  imports: [
    CardContainerComponent,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ToolbarComponent,
    UiSkeletonComponent,
    UiGridBlockComponent,
    ReactiveFormsModule,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './template-create.component.html',
  styleUrl: './template-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateCreateComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly TemplatesLocalization = TemplatesLocalization;

  protected readonly selectors = createSelectMap({
    isSaveInProgress: TemplatesSelectors.getSlices.isSaveInProgress,
  });
  protected readonly actions = createDispatchMap({
    createTemplate: CreateTemplate,
  });

  protected readonly form = this.fb.group<TemplateCreationForm>({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(MAX_NAME_LENGTH)]),
    description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_DESCRIPTION_LENGTH)]),
  });

  protected createQrCard(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.actions.createTemplate(this.form.getRawValue(), this.destroyRef);
  }

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly RouteTitles = RouteTitles;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;
}

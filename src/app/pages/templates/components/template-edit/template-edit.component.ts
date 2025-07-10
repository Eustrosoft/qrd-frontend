import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { CreateTemplate, FetchTemplate, SaveTemplate } from '@app/pages/templates/state/templates.actions';
import { MatButton } from '@angular/material/button';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { TemplatesLocalization } from '@app/pages/templates/templates.constants';

@Component({
  selector: 'template-edit',
  imports: [
    CardContainerComponent,
    ToolbarComponent,
    UiSkeletonComponent,
    MatButton,
    UiGridBlockComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
  ],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly templateId = this.activatedRoute.snapshot.paramMap.get('id');

  protected readonly selectors = createSelectMap({
    isTemplateLoading: TemplatesState.isTemplateLoading$,
    isSaveInProgress: TemplatesState.isSaveInProgress$,
    template: TemplatesState.getTemplate$,
  });
  protected readonly actions = createDispatchMap({
    fetchTemplate: FetchTemplate,
    createTemplate: CreateTemplate,
    saveTemplate: SaveTemplate,
  });

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly templateEff = effect(() => {
    console.log(this.selectors.template());
  });

  protected readonly RouteTitles = RouteTitles;
  protected readonly TemplatesLocalization = TemplatesLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    if (this.templateId) {
      this.actions.fetchTemplate(+this.templateId, this.destroyRef);
    }
  }

  protected saveData(): void {
    if (this.templateId) {
      this.actions.saveTemplate(+this.templateId, {}, this.destroyRef);
      return;
    }
    this.actions.createTemplate({}, this.destroyRef);
  }
}

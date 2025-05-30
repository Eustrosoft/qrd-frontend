import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';
import { MatAnchor } from '@angular/material/button';
import { IS_SMALL, IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { RouterLink } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { Locale } from '@app/app.models';
import { createSelectMap, dispatch } from '@ngxs/store';
import { AppState } from '@app/state/app.state';
import { FormsModule } from '@angular/forms';
import { SetLocale } from '@app/state/app.actions';
import { FooterLocalization } from '@shared/components/qrd-footer/qrd-footer.constants';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { Option } from '@shared/shared.models';
import { QrdLogoComponent } from '@shared/components/qrd-logo/qrd-logo.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { TextInteractionEffect } from '@shared/directives/text-interaction-effect.directive';

@Component({
  selector: 'qrd-footer',
  imports: [
    MatAnchor,
    RouterLink,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatFormField,
    MatSelect,
    FormsModule,
    QrdLogoComponent,
    UiFlexBlockComponent,
    UiGridBlockComponent,
    TextInteractionEffect,
  ],
  templateUrl: './qrd-footer.component.html',
  styleUrl: './qrd-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdFooterComponent {
  private readonly isXSmall = inject(IS_XSMALL);
  private readonly isSmall = inject(IS_SMALL);
  protected readonly selectors = createSelectMap({
    locale: AppState.getLocale$,
    availableLocales: DictionaryRegistryState.getDictionary$<Option<string>>('locales'),
  });
  protected readonly setLocale = dispatch(SetLocale);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly FooterLocalization = FooterLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly currentYear = new Date().getFullYear();

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    if (this.isSmall()) {
      return 'repeat(2, 1fr)';
    }
    return 'repeat(4, 1fr)';
  });

  protected readonly localeModel = model<Locale>(this.selectors.locale());

  protected updateLocale(event: MatSelectChange<Locale>): void {
    if (confirm($localize`Для смены языка требуется перезагрузка страницы, продолжить?`)) {
      this.setLocale(event.value, true);
      return;
    }
    event.source.writeValue(this.selectors.locale());
  }
}

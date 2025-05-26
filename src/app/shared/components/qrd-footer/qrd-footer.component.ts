import { ChangeDetectionStrategy, Component, computed, effect, inject, model } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { NgOptimizedImage } from '@angular/common';
import { FooterLocalization, SharedLocalization } from '@shared/shared.constants';
import { MatAnchor } from '@angular/material/button';
import { IS_SMALL, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { RouterLink } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Locale } from '@app/app.models';
import { createSelectMap, dispatch } from '@ngxs/store';
import { AppState } from '@app/state/app.state';
import { FormsModule } from '@angular/forms';
import { SetLocale } from '@app/state/app.actions';

@Component({
  selector: 'qrd-footer',
  imports: [FlexBlockComponent, NgOptimizedImage, MatAnchor, RouterLink, MatFormField, MatLabel, MatOption, MatSelect, MatFormField, MatSelect, FormsModule],
  templateUrl: './qrd-footer.component.html',
  styleUrl: './qrd-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdFooterComponent {
  protected readonly selectors = createSelectMap({
    locale: AppState.getLocale$,
    availableLocales: AppState.getAvailableLocales$,
  });

  private readonly setLocale = dispatch(SetLocale);
  private readonly isXSmall = inject(IS_XSMALL);
  private readonly isSmall = inject(IS_SMALL);
  protected readonly isSmallScreen = computed<boolean>(() => this.isXSmall() || this.isSmall());
  protected readonly FooterLocalization = FooterLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly currentYear = new Date().getFullYear();

  protected readonly localeModel = model<Locale>(this.selectors.locale());
  private readonly localeChangeEffect = effect(() => {
    this.setLocale(this.localeModel());
  });
}

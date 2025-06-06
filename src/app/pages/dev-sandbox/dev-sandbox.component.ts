/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { MatAnchor, MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { dispatch } from '@ngxs/store';
import { SetLocale, SetTheme } from '@app/state/app.actions';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { PaletteAnimationDirective } from '@shared/directives/palette-animation.directive';
import { CURRENT_BREAKPOINT } from '@cdk/tokens/current-breakpoint.token';
import { IS_LANDSCAPE, IS_PORTRAIT } from '@cdk/tokens/screen-orientation.tokens';
import { IS_LARGE, IS_MEDIUM, IS_SMALL, IS_XLARGE, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { DatePipe } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatError } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CreateMenuOverlayComponent } from '@shared/components/create-menu-overlay/create-menu-overlay.component';

@Component({
  selector: 'dev-sandbox',
  imports: [
    MatAnchor,
    MatButton,
    MatFabButton,
    MatMiniFabButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatIconButton,
    PaletteAnimationDirective,
    DatePipe,
    MatOption,
    MatSelect,
    MatError,
    FormsModule,
    MatSuffix,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatCheckbox,
    MatSlideToggle,
    UiFlexBlockComponent,
    UiBadgeComponent,
    MatIcon,
    MatTooltip,
    ReactiveFormsModule,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
  templateUrl: './dev-sandbox.component.html',
  styleUrl: './dev-sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevSandboxComponent {
  protected readonly currentBreakpoint = inject(CURRENT_BREAKPOINT);
  protected readonly isLandscape = inject(IS_LANDSCAPE);
  protected readonly isPortrait = inject(IS_PORTRAIT);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmall = inject(IS_SMALL);
  protected readonly isMedium = inject(IS_MEDIUM);
  protected readonly isLarge = inject(IS_LARGE);
  protected readonly isXLarge = inject(IS_XLARGE);
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly setTheme = dispatch(SetTheme);
  protected readonly setLocale = dispatch(SetLocale);
  protected readonly currBreakpointEffect = effect(() => {
    console.log('currentBreakpoint', this.currentBreakpoint());
  });
  protected readonly orientationEffect = effect(() => {
    console.log('isPortrait', this.isPortrait());
    console.log('isLandscape', this.isLandscape());
  });
  protected readonly mediaBreakpointsEffect = effect(() => {
    console.log('isXSmall', this.isXSmall());
    console.log('isSmall', this.isSmall());
    console.log('isMedium', this.isMedium());
    console.log('isLarge', this.isLarge());
    console.log('isXLarge', this.isXLarge());
  });
  protected readonly now = Date.now();
  protected readonly optionList = [
    { value: null, viewValue: '' },
    { value: 1, viewValue: 'Steak' },
    { value: 2, viewValue: 'Pizza' },
    { value: 3, viewValue: 'Borsch' },
  ];
  protected inputFieldModel = model('');

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(CreateMenuOverlayComponent);
  }
}

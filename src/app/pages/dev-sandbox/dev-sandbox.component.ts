/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { MatAnchor, MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { dispatch } from '@ngxs/store';
import { SetLocale, SetTheme } from '@app/state/app.actions';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { PaletteAnimationDirective } from '@cdk/directives/palette-animation.directive';
import { CURRENT_BREAKPOINT } from '@cdk/tokens/current-breakpoint.token';
import { IS_LANDSCAPE, IS_PORTRAIT } from '@cdk/tokens/screen-orientation.tokens';
import { IS_LARGE, IS_MEDIUM, IS_SMALL, IS_XLARGE, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'dev-sandbox',
  imports: [
    FlexBlockComponent,
    MatAnchor,
    MatButton,
    MatFabButton,
    MatMiniFabButton,
    UiIconComponent,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatIconButton,
    PaletteAnimationDirective,
    DatePipe,
  ],
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

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(UiIconComponent, { inputs: { icon: 'arrow-bottom' } });
  }
}

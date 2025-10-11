import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { select } from '@ngxs/store';
import { NgOptimizedImage } from '@angular/common';
import { DefaultLayoutConfig } from '@shared/shared.constants';
import { AppSelectors } from '@app/state/app.selectors';

@Component({
  selector: 'qrd-logo',
  imports: [UiFlexBlockComponent, NgOptimizedImage],
  templateUrl: './qrd-logo.component.html',
  styleUrl: './qrd-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdLogoComponent {
  protected readonly layoutConfigState = select(AppSelectors.getLayoutConfigState$);
  protected readonly DefaultLayoutConfig = DefaultLayoutConfig;
}

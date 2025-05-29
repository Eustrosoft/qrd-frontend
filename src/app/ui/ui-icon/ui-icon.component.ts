import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { dispatch, Store } from '@ngxs/store';
import { GetIcon } from '@shared/state/icon-registry.actions';
import { Icon, IconSvgParams } from '@app/app.models';
import { CursorType, Display, VerticalAlign } from '@shared/shared.models';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { IconRegistryState } from '@shared/state/icon-registry.state';

@Component({
  selector: 'ui-icon',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    '[style.display]': 'display()',
    '[style.vertical-align]': 'verticalAlign()',
    '[style.cursor]': 'cursor()',
    '[style.width]': 'width() + "px"',
    '[style.height]': 'height()  + "px"',
    '[style.color]': 'color()',
    '[innerHTML]': 'this.iconState()?.iconSvg ?? ""',
  },
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltip: tooltipText', 'matTooltipPosition: tooltipPosition', 'matTooltipClass: tooltipClass'],
    },
  ],
})
export class UiIconComponent {
  private readonly store = inject(Store);
  private readonly getIcon = dispatch(GetIcon);

  public readonly icon = input.required<Icon>();
  public readonly width = input<string>('16');
  public readonly height = input<string>('16');

  public readonly cursor = input<CursorType>('auto');
  public readonly color = input<string>('var(--mat-sys-primary)');
  public readonly display = input<Display>('inline-flex');
  public readonly verticalAlign = input<VerticalAlign>('middle');

  private readonly svgParams = computed<IconSvgParams>(() => ({ width: this.width(), height: this.height() }));

  protected readonly iconState = toSignal(toObservable(this.icon).pipe(switchMap((icon) => this.store.select(IconRegistryState.getIcon$(icon, this.svgParams())))));

  private readonly iconChangeEffect = effect(() => {
    this.getIcon(this.icon(), this.svgParams());
  });
}

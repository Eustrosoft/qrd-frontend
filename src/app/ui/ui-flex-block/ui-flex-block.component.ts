import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { Display, FlexAlignItems, FlexDirection, FlexJustifyContent, FlexWrap, Overflow } from '@shared/shared.models';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';

@Component({
  selector: 'ui-flex-block, *[ui-flex-block]',
  imports: [],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': 'flexDisplay()',
    '[style.flex-flow]': 'flexDirection() + " " + flexWrap()',
    '[style.gap]': 'gapSize()',
    '[style.align-items]': 'flexAlignItems()',
    '[style.justify-content]': 'flexJustifyContent()',
    '[style.flex]': 'flex()',
    '[style.align-self]': 'flexAlignSelf()',
    '[style.overflow]': 'overflow()',
  },
})
export class UiFlexBlockComponent {
  private readonly pxToRemPipe: PxToRemPipe = inject(PxToRemPipe);

  public readonly flexDisplay: InputSignal<Display> = input<Display>('flex');
  public readonly flexDirection: InputSignal<FlexDirection> = input<FlexDirection>('row');
  public readonly gapSize: InputSignal<string> = input('1rem', {
    transform: (value: string) => this.pxToRemPipe.transform(value),
  });
  public readonly flexAlignItems: InputSignal<FlexAlignItems> = input<FlexAlignItems>('');
  public readonly flexJustifyContent: InputSignal<FlexJustifyContent> = input<FlexJustifyContent>('');
  public readonly flex: InputSignal<string | number> = input<string | number>('');
  public readonly flexAlignSelf: InputSignal<FlexAlignItems> = input<FlexAlignItems>('');
  public readonly flexWrap: InputSignal<FlexWrap> = input<FlexWrap>('nowrap');
  public readonly overflow: InputSignal<Overflow> = input<Overflow>('visible');
}

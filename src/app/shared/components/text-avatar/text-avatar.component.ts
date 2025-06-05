import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { TextAvatarPipe } from '@shared/pipe/text-avatar.pipe';

@Component({
  selector: 'text-avatar',
  imports: [],
  providers: [TextAvatarPipe],
  template: '{{ text() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.background]': '"var(--mat-sys-primary)"',
    '[style.border-radius]': '"100%"',
    '[style.width]': '"48px"',
    '[style.height]': '"48px"',
    '[style.line-height]': '"48px"',
    '[style.text-align]': '"center"',
    '[style.color]': '"var(--mat-sys-on-primary)"',
  },
})
export class TextAvatarComponent {
  private readonly textAvatarPipe = inject(TextAvatarPipe);

  public readonly text: InputSignal<string> = input('', {
    transform: (value: string) => this.textAvatarPipe.transform(value),
  });
}

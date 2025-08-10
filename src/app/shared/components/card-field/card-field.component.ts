import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'card-field',
  imports: [],
  templateUrl: './card-field.component.html',
  styleUrl: './card-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFieldComponent {
  public readonly caption = input<string>('');
}

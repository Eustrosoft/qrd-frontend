import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cards',
  imports: [],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {}

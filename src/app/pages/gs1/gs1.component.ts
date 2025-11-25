import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'gs1',
  imports: [RouterOutlet],
  templateUrl: './gs1.component.html',
  styleUrl: './gs1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gs1Component {}

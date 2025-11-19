import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'markings',
  imports: [RouterOutlet],
  templateUrl: './markings.component.html',
  styleUrl: './markings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkingsComponent {}

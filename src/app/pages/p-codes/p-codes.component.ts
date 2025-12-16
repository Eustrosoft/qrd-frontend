import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'p-codes',
  imports: [RouterOutlet],
  templateUrl: './p-codes.component.html',
  styleUrl: './p-codes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PCodesComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'templates',
  imports: [],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'template-main',
  imports: [],
  templateUrl: './template-main.component.html',
  styleUrl: './template-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateMainComponent {}

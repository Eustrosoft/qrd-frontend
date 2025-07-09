import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'template-view',
  imports: [],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateViewComponent {}

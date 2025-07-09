import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'template-attrs',
  imports: [],
  templateUrl: './template-attrs.component.html',
  styleUrl: './template-attrs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateAttrsComponent {}

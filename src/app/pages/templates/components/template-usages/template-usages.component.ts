import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';

@Component({
  selector: 'template-usages',
  imports: [],
  templateUrl: './template-usages.component.html',
  styleUrl: './template-usages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateUsagesComponent {
  protected readonly SharedLocalization = SharedLocalization;
}

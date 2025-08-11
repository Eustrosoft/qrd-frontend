import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';

@Component({
  selector: 'file-usages',
  imports: [],
  templateUrl: './file-usages.component.html',
  styleUrl: './file-usages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUsagesComponent {
  protected readonly SharedLocalization = SharedLocalization;
}

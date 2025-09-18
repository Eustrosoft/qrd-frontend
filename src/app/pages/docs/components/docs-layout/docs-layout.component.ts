import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';

@Component({
  selector: 'docs-layout',
  imports: [],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutComponent {
  protected readonly SharedLocalization = SharedLocalization;
}

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink, UrlTree } from '@angular/router';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'view-toolbar',
  imports: [MatIcon, MatMiniFabButton, RouterLink, UiFlexBlockComponent],
  templateUrl: './view-toolbar.component.html',
  styleUrl: './view-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewToolbarComponent {
  protected readonly activatedRoute = inject(ActivatedRoute);

  public readonly navigateTo = input<string | UrlTree | null | undefined>('../');
}

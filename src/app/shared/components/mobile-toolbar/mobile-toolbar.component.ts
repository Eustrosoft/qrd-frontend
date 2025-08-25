import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'mobile-toolbar',
  imports: [MatIcon, RouterLink, MatMiniFabButton, MoreMenuComponent, UiFlexBlockComponent],
  templateUrl: './mobile-toolbar.component.html',
  styleUrl: './mobile-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileToolbarComponent {
  protected readonly activatedRoute = inject(ActivatedRoute);

  public readonly showMoreMenu = input<boolean>(false);
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createSelectMap, select } from '@ngxs/store';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { BottomNavbarLink } from '@shared/components/bottom-navbar/bottom-navbar.models';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';

@Component({
  selector: 'bottom-navbar',
  imports: [MatNavList, MatListItem, RouterLink, RouterLinkActive, UiIconComponent, EllipsisDirective],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavbarComponent {
  protected readonly selectors = createSelectMap({
    navbarLinks: select(DictionaryRegistryState.getDictionary$<BottomNavbarLink>('bottomNavbarLinks')),
  });
}

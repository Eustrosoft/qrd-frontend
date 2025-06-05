import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createSelectMap, select } from '@ngxs/store';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BottomNavbarLink } from '@shared/components/bottom-navbar/bottom-navbar.models';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'bottom-navbar',
  imports: [MatNavList, MatListItem, RouterLink, RouterLinkActive, EllipsisDirective, MatIcon],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavbarComponent {
  protected readonly selectors = createSelectMap({
    navbarLinks: select(DictionaryRegistryState.getDictionary$<BottomNavbarLink>('bottomNavbarLinks')),
  });
}

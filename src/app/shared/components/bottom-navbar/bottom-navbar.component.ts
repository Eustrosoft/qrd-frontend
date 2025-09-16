import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatIcon } from '@angular/material/icon';
import { AppState } from '@app/state/app.state';
import { select } from '@ngxs/store';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';

@Component({
  selector: 'bottom-navbar',
  imports: [MatNavList, MatListItem, RouterLink, RouterLinkActive, EllipsisDirective, MatIcon, FallbackPipe],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavbarComponent {
  protected readonly layoutConfigState = select(AppState.getLayoutConfigState$);
}

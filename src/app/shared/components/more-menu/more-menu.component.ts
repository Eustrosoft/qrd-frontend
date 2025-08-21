import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'more-menu',
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuTrigger],
  templateUrl: './more-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreMenuComponent {}

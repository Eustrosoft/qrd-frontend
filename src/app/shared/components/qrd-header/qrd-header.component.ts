import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';

@Component({
  selector: 'qrd-header',
  imports: [MatButton],
  templateUrl: './qrd-header.component.html',
  styleUrl: './qrd-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdHeaderComponent {
  protected readonly uiSidenavService = inject(UiSidenavService);

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(UiIconComponent, { inputs: { icon: 'palette' }, width: 'md' });
  }
}

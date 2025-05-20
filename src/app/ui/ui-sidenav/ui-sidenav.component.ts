import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'ui-sidenav',
  imports: [MatSidenav, MatSidenavContainer, MatSidenavContent, NgComponentOutlet],
  templateUrl: './ui-sidenav.component.html',
  styleUrl: './ui-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavComponent implements AfterViewInit {
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly matSidenav = viewChild.required(MatSidenav);

  public ngAfterViewInit(): void {
    this.uiSidenavService.setSidenav(this.matSidenav());
  }
}

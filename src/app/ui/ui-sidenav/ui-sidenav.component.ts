import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  inject,
  Renderer2,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';

@Component({
  selector: 'ui-sidenav',
  imports: [MatSidenav, MatSidenavContainer, MatSidenavContent],
  templateUrl: './ui-sidenav.component.html',
  styleUrl: './ui-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavComponent implements AfterViewInit {
  protected readonly document = inject(DOCUMENT);
  protected readonly renderer = inject(Renderer2);
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly matSidenav = viewChild.required(MatSidenav);
  protected readonly vcr = viewChild.required('container', { read: ViewContainerRef });

  protected readonly overflowEffect = effect(() => {
    if (this.uiSidenavService.isOpen()) {
      this.renderer.setStyle(this.document.documentElement, 'overflow', 'hidden');
    } else {
      this.renderer.setStyle(this.document.documentElement, 'overflow', 'auto');
    }
  });

  public ngAfterViewInit(): void {
    this.uiSidenavService.setSidenav(this.matSidenav());
    this.uiSidenavService.setSidenavVcr(this.vcr());
  }

  protected backDropClick(): void {
    this.uiSidenavService.sidenavConfig()?.onBackdropClick?.call(this);
  }
}

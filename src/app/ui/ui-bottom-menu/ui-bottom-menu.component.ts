import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild, ViewContainerRef } from '@angular/core';
import { UiBottomMenuService } from '@ui/ui-bottom-menu/ui-bottom-menu.service';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';

@Component({
  selector: 'ui-bottom-menu',
  imports: [],
  templateUrl: './ui-bottom-menu.component.html',
  styleUrl: './ui-bottom-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': 'isSmallScreen() ? "block" : "none"',
  },
})
export class UiBottomMenuComponent implements AfterViewInit {
  private readonly uiBottomMenuService = inject(UiBottomMenuService);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  protected readonly vcr = viewChild.required('menuContainer', { read: ViewContainerRef });

  public ngAfterViewInit(): void {
    this.uiBottomMenuService.setBottomMenuVcr(this.vcr());
  }
}

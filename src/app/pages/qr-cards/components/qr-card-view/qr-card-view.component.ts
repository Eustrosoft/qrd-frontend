import { ChangeDetectionStrategy, Component, DestroyRef, inject, inputBinding, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { AppRoutes } from '@app/app.constants';
import { TabLink } from '@shared/shared.models';
import { UpperCasePipe } from '@angular/common';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ViewToolbarComponent } from '@shared/components/view-toolbar/view-toolbar.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { MatButton } from '@angular/material/button';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FetchQrCard } from '@app/pages/qr-cards/state/qr-cards.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { MatIcon } from '@angular/material/icon';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { TruncateDirective } from '@shared/directives/truncate.directive';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';

@Component({
  selector: 'qr-card-view',
  imports: [
    RouterOutlet,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    UpperCasePipe,
    UiFlexBlockComponent,
    ViewToolbarComponent,
    MatButton,
    RouterLink,
    UiSkeletonComponent,
    MatIcon,
    InteractionEffect,
    TruncateDirective,
    ToHexPipe,
    RouterLinkActive,
  ],
  templateUrl: './qr-card-view.component.html',
  styleUrl: './qr-card-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardViewComponent implements OnInit {
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });
  protected readonly selectors = createSelectMap({
    isQrCardLoading: QrCardsState.isQrCardLoading$,
    qrCard: QrCardsState.getQrCard$,
    qrCardPreviewUrl: QrCardsState.getQrCardPreviewUrl$,
  });
  protected readonly actions = createDispatchMap({
    fetchQrCard: FetchQrCard,
  });
  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.qrCard, title: RouteTitles.card },
    { link: AppRoutes.attrs, title: RouteTitles.attrs },
  ];
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchQrCard(this.routeParams()['code'], this.destroyRef);
  }

  protected openCardPreview(): void {
    this.uiSidenavService.open(QrViewComponent, {
      bindings: [inputBinding('iframeSrc', this.selectors.qrCardPreviewUrl)],
      position: 'end',
    });
  }
}

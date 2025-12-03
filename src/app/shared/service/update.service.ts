import { ApplicationRef, DOCUMENT, inject, Injectable, isDevMode } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, first, interval, switchMap } from 'rxjs';
import { SnackbarService } from '@shared/service/snackbar.service';
import { select } from '@ngxs/store';
import { DefaultConfig } from '@shared/shared.constants';
import { NotificationSnackbarLocalization } from '@modules/error/error.constants';
import { AppSelectors } from '@app/state/app.selectors';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly appRef = inject(ApplicationRef);
  private readonly swUpdate = inject(SwUpdate);
  private readonly snackbarService = inject(SnackbarService);
  private readonly document = inject(DOCUMENT);
  private readonly configState = select(AppSelectors.getConfigState$);

  constructor() {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable && !isDevMode()));
    const pollInterval$ = interval(
      this.configState().config.qrdConf?.pollInterval ?? DefaultConfig.qrdConf.pollInterval,
    );
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, pollInterval$);
    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        await this.swUpdate.checkForUpdate();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to check for updates:', err);
      }
    });

    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        switchMap(() => this.snackbarService.showOnce(NotificationSnackbarLocalization.newVersion, 'OK').onAction()),
      )
      .subscribe(() => {
        this.document.location.reload();
      });
  }
}

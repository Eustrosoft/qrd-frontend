import { Injectable, Injector, signal } from '@angular/core';
import { SidenavConfig } from '@ui/ui-sidenav/ui-sidenav.models';
import { MatSidenav } from '@angular/material/sidenav';
import { first, from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiSidenavService {
  private readonly defaultSidenavConfig: SidenavConfig = {
    inputs: {},
    content: [],
    injector: Injector.create({ providers: [] }),
    mode: 'over',
    autoFocus: 'first-tabbable',
    position: 'start',
    width: 'sm',
    hasBackdrop: true,
    onSidenavClose: null,
    onBackdropClick: null,
  };

  private readonly _matSidenav = signal<MatSidenav | null>(null);
  private readonly _isOpen = signal<boolean>(false);
  // eslint-disable-next-line
  private readonly _sidenavCmp = signal<any | null>(null);
  private readonly _sidenavConfig = signal<SidenavConfig>(this.defaultSidenavConfig);

  public readonly isOpen = this._isOpen.asReadonly();
  public readonly sidenavCmp = this._sidenavCmp.asReadonly();

  public readonly sidenavConfig = this._sidenavConfig.asReadonly();

  public setSidenav(sidenav: MatSidenav): void {
    if (this._matSidenav()) {
      return;
    }
    this._matSidenav.set(sidenav);
    this.initCloseSubscription();
  }

  public backDropClick(): void {
    this._sidenavConfig()?.onBackdropClick?.call(this);
  }

  public close(): void {
    this._isOpen.set(false);
  }

  public open<T>(cmp: T, config: Partial<SidenavConfig> = this.defaultSidenavConfig): void {
    if (this.isOpen()) {
      from(this._matSidenav()!.close())
        .pipe(
          tap({
            next: () => {
              this.openNew(cmp, config);
            },
          }),
          first(),
        )
        .subscribe();
      return;
    }
    this.openNew(cmp, config);
  }

  private openNew<T>(cmp: T, config: Partial<SidenavConfig> = this.defaultSidenavConfig): void {
    this._sidenavCmp.set(null);
    const cfg: SidenavConfig = {
      inputs: config.inputs ?? this.defaultSidenavConfig.inputs,
      content: config.content ?? this.defaultSidenavConfig.content,
      injector: config.injector ?? this.defaultSidenavConfig.injector,
      mode: config.mode ?? this.defaultSidenavConfig.mode,
      autoFocus: config.autoFocus ?? this.defaultSidenavConfig.autoFocus,
      position: config.position ?? this.defaultSidenavConfig.position,
      width: config.width ?? this.defaultSidenavConfig.width,
      hasBackdrop: config.hasBackdrop ?? this.defaultSidenavConfig.hasBackdrop,
      onSidenavClose: config.onSidenavClose ?? this.defaultSidenavConfig.onSidenavClose,
      onBackdropClick: config.onBackdropClick ?? this.defaultSidenavConfig.onBackdropClick,
    };
    this._sidenavConfig.set(cfg);
    this._sidenavCmp.set(cmp);
    this._isOpen.set(true);
  }

  private initCloseSubscription(): void {
    this._matSidenav()
      ?._closedStream.pipe(
        tap({
          next: () => {
            this._sidenavConfig()?.onSidenavClose?.call(this);
            this._isOpen.set(false);
            this._sidenavCmp.set(null);
          },
        }),
      )
      .subscribe();
  }
}

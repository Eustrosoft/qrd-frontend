import { ComponentRef, Injectable, Injector, signal, Type, ViewContainerRef } from '@angular/core';
import { SidenavConfig } from '@ui/ui-sidenav/ui-sidenav.models';
import { MatSidenav } from '@angular/material/sidenav';
import { first, from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiSidenavService {
  private readonly defaultSidenavConfig: SidenavConfig = {
    bindings: [],
    directives: [],
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
  private readonly _sidenavVcr = signal<ViewContainerRef | null>(null);
  private readonly _sidenavCmpRef = signal<ComponentRef<unknown> | undefined>(undefined);
  private readonly _sidenavConfig = signal<SidenavConfig>(this.defaultSidenavConfig);

  public readonly isOpen = this._isOpen.asReadonly();
  public readonly sidenavCmpRef = this._sidenavCmpRef.asReadonly();

  public readonly sidenavConfig = this._sidenavConfig.asReadonly();

  public setSidenavVcr(vcr: ViewContainerRef): void {
    if (this._sidenavVcr()) {
      return;
    }
    this._sidenavVcr.set(vcr);
  }

  public setSidenav(sidenav: MatSidenav): void {
    if (this._matSidenav()) {
      return;
    }
    this._matSidenav.set(sidenav);
    this.initCloseSubscription();
  }

  public close(): void {
    this._isOpen.set(false);
  }

  public open<T>(cmp: Type<T>, config: Partial<SidenavConfig> = this.defaultSidenavConfig): void {
    if (this._isOpen()) {
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

  private openNew<T>(cmp: Type<T>, config: Partial<SidenavConfig> = this.defaultSidenavConfig): void {
    this.clearCmpVcr();
    const cfg: SidenavConfig = {
      bindings: config.bindings ?? this.defaultSidenavConfig.bindings,
      directives: config.directives ?? this.defaultSidenavConfig.directives,
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
    const cmpRef = this._sidenavVcr()?.createComponent<T>(cmp, {
      bindings: cfg.bindings,
      directives: cfg.directives,
      projectableNodes: cfg.content,
      injector: cfg.injector,
    });
    this._sidenavCmpRef.set(cmpRef);
    this._isOpen.set(true);
  }

  private initCloseSubscription(): void {
    this._matSidenav()
      ?._closedStream.pipe(
        tap({
          next: () => {
            this._sidenavConfig()?.onSidenavClose?.call(this);
            this._isOpen.set(false);
            this.clearCmpVcr();
          },
        }),
      )
      .subscribe();
  }

  private clearCmpVcr(): void {
    this._sidenavVcr()?.clear();
    this._sidenavCmpRef.set(undefined);
  }
}

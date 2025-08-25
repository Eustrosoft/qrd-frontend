import { ComponentRef, Injectable, Injector, signal, Type, ViewContainerRef } from '@angular/core';
import { BottomMenuConfig } from '@ui/ui-bottom-menu/ui-bottom-menu.models';
import { BottomNavbarComponent } from '@shared/components/bottom-navbar/bottom-navbar.component';

@Injectable({
  providedIn: 'root',
})
export class UiBottomMenuService {
  private readonly defaultMenuConfig: BottomMenuConfig = {
    bindings: [],
    directives: [],
    content: [],
    injector: Injector.create({ providers: [] }),
  };

  private readonly _menuVcr = signal<ViewContainerRef | null>(null);
  private readonly _menuCmpRef = signal<ComponentRef<unknown> | undefined>(undefined);
  private readonly _menuConfig = signal<BottomMenuConfig>(this.defaultMenuConfig);

  public setBottomMenuVcr(vcr: ViewContainerRef): void {
    if (this._menuVcr()) {
      return;
    }
    this._menuVcr.set(vcr);
  }

  public render<T>(cmp: Type<T>, config: Partial<BottomMenuConfig> = this.defaultMenuConfig): void {
    this.clearCmpVcr();
    const cfg = this.mergeConfig(config);
    this._menuConfig.set(cfg);
    this.createComponent(cmp, cfg);
  }

  public renderDefaultCmp(): void {
    this.render(BottomNavbarComponent);
  }

  private createComponent<T>(cmp: Type<T>, cfg: BottomMenuConfig): void {
    const cmpRef = this._menuVcr()?.createComponent<T>(cmp, {
      bindings: cfg.bindings,
      directives: cfg.directives,
      projectableNodes: cfg.content,
      injector: cfg.injector,
    });
    this._menuCmpRef.set(cmpRef);
  }

  private mergeConfig(config: Partial<BottomMenuConfig>): BottomMenuConfig {
    return { ...this.defaultMenuConfig, ...config };
  }

  private clearCmpVcr(): void {
    this._menuVcr()?.clear();
    this._menuCmpRef.set(undefined);
  }
}

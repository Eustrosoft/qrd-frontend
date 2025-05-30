import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { inject, Injectable } from '@angular/core';
import { SharedLocalization } from '@shared/shared.constants';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  private readonly title: Title = inject(Title);
  private readonly defaultTitle: string = SharedLocalization.defaultTitle;

  constructor() {
    super();
  }

  public override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    this.title.setTitle(this.defaultTitle);
    if (title !== undefined) {
      this.title.setTitle(`${this.defaultTitle} | ${title}`);
    }
  }
}

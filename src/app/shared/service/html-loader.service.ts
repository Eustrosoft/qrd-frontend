import { inject, Injectable, Renderer2 } from '@angular/core';
import { RENDERER2 } from '@cdk/tokens/renderer.token';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HtmlLoaderService {
  private readonly document: Document = inject(DOCUMENT);
  private readonly renderer: Renderer2 = inject(RENDERER2);

  public loadLinkStylesheet(filePath: string, id: string): HTMLLinkElement {
    this.removeExistingElementById(this.document.head, id);

    const linkElement: HTMLLinkElement = this.renderer.createElement('link');
    this.renderer.setProperty(linkElement, 'rel', 'stylesheet');
    this.renderer.setProperty(linkElement, 'href', filePath);
    this.renderer.setProperty(linkElement, 'id', id);

    this.renderer.appendChild(this.document.head, linkElement);

    return linkElement;
  }

  public removeExistingElementById(parentElement: HTMLElement, id: string): void {
    const element = this.document.getElementById(id);
    if (element) {
      this.renderer.removeChild(parentElement, element);
    }
  }
}

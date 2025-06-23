import { Directive, HostListener, inject, input } from '@angular/core';
import { WINDOW } from '@cdk/tokens/window.token';

@Directive({
  selector: 'a[externalLink]',
})
export class ExternalLinkDirective {
  private readonly window = inject(WINDOW);
  public readonly externalLink = input<string>('');

  @HostListener('click', ['$event'])
  protected onClick(event: Event): void {
    if (!this.externalLink()) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this.window.open(this.externalLink(), '_blank', 'noopener noreferrer');
  }
}

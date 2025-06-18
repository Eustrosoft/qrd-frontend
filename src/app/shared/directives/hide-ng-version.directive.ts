import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[hideNgVersion]',
})
export class HideNgVersionDirective implements OnInit {
  private readonly elRef = inject(ElementRef);

  public ngOnInit(): void {
    this.elRef.nativeElement.removeAttribute('ng-version');
  }
}

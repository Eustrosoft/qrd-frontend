import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[textareaAutoresize]',
})
export class TextareaAutoresizeDirective implements OnInit {
  private readonly elRef = inject(ElementRef);

  public readonly minRows = input<number>(5);
  public readonly maxRows = input<number>(20);

  @HostListener('input')
  public onInput(): void {
    this.resize();
  }

  public ngOnInit(): void {
    this.resize();
  }

  private resize(): void {
    const textarea = this.elRef.nativeElement;
    const lineHeight = 24; // line-height for Lato 16px font in textarea

    textarea.style.height = 'auto';

    const calculatedHeight = textarea.scrollHeight;
    const minHeight = this.minRows() * lineHeight;
    const maxHeight = this.maxRows() * lineHeight;

    const maxCalculatedHeight = Math.max(calculatedHeight, minHeight);

    textarea.style.height = `${Math.min(maxCalculatedHeight, maxHeight)}px`;
  }
}

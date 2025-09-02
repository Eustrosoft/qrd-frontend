import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[swipe]',
})
export class SwipeDirective {
  public readonly swipeLeft = output<void>();
  public readonly swipeRight = output<void>();
  public readonly swipeUp = output<void>();
  public readonly swipeDown = output<void>();

  private startX = 0;
  private startY = 0;
  private pointerActive = false;
  private readonly threshold = 50;

  @HostListener('pointerdown', ['$event'])
  public onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return; // only LMB
    this.pointerActive = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  @HostListener('pointerup', ['$event'])
  public onPointerUp(event: PointerEvent): void {
    if (!this.pointerActive) return;
    this.pointerActive = false;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > this.threshold) this.swipeRight.emit();
      else if (deltaX < -this.threshold) this.swipeLeft.emit();
    } else {
      if (deltaY > this.threshold) this.swipeDown.emit();
      else if (deltaY < -this.threshold) this.swipeUp.emit();
    }
  }
}

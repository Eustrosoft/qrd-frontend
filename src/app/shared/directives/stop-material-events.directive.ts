import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[cdkStopMaterialEvents]',
  standalone: true,
})
export class StopMaterialEventsDirective {
  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const isCtrlA = event.ctrlKey && event.code === 'KeyA';
    const isCtrlHome = event.ctrlKey && event.code === 'Home';
    const isCtrlEnd = event.ctrlKey && event.code === 'End';
    const isHome = event.code === 'Home';
    const isEnd = event.code === 'End';
    if (isCtrlA || isCtrlHome || isCtrlEnd || isHome || isEnd) {
      event.stopPropagation();
    }
  }
}

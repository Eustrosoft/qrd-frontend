import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'qr-view',
  imports: [],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrViewComponent implements OnInit {
  private readonly domSanitizer = inject(DomSanitizer);
  public readonly iframeSrc = input.required<string>();

  protected readonly src = computed(() => this.domSanitizer.bypassSecurityTrustResourceUrl(this.iframeSrc()));

  public ngOnInit(): void {
    console.log('mng');
  }
}

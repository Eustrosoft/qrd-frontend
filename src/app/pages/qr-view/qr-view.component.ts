import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'qr-view',
  imports: [],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrViewComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    console.log('mng');
  }
}

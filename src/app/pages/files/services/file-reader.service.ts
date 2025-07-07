import { Injectable } from '@angular/core';
import { mergeMap, Observable, of, Subscriber } from 'rxjs';

import { DEFAULT_CHUNK_SIZE } from '@app/pages/files/files.constants';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  public splitBinary(file: File, chunkSize: number = DEFAULT_CHUNK_SIZE): Observable<Blob[]> {
    return this.blobToArrayBuffer(file).pipe(
      mergeMap((buff) => {
        let startPointer = 0;
        const endPointer = buff.byteLength;
        const chunks = [];
        while (startPointer < endPointer) {
          const newStartPointer = startPointer + chunkSize;
          const chunk = buff.slice(startPointer, newStartPointer);
          chunks.push(new Blob([chunk]));
          startPointer = newStartPointer;
        }
        return of(chunks);
      }),
    );
  }

  private blobToArrayBuffer(blob: Blob | File): Observable<ArrayBuffer> {
    return new Observable((obs: Subscriber<ArrayBuffer>) => {
      if (!(blob instanceof Blob)) {
        obs.error(new Error('`blob` must be an instance of File or Blob.'));
        return;
      }

      const reader = new FileReader();

      reader.onerror = (err): void => obs.error(err);
      reader.onabort = (err): void => obs.error(err);
      reader.onload = (): void => obs.next(<ArrayBuffer>reader.result);
      reader.onloadend = (): void => obs.complete();

      return reader.readAsArrayBuffer(blob);
    });
  }
}

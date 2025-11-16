import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DefaultChunkSize } from '@app/pages/files/files.constants';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  public splitBinary(file: File, chunkSize: number = DefaultChunkSize): Observable<readonly Blob[]> {
    if (!(file instanceof Blob)) {
      return throwError(() => new Error('Input must be a File or Blob object'));
    }

    if (chunkSize <= 0) {
      return throwError(() => new Error('Chunk size must be a positive number'));
    }

    return new Observable<readonly Blob[]>((subscriber) => {
      const fileSize = file.size;
      const chunkCount = Math.ceil(fileSize / chunkSize);
      const chunks = Array.from({ length: chunkCount }, (_, i) => {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        return file.slice(start, end);
      });

      subscriber.next(chunks);
      subscriber.complete();
    });
  }
}

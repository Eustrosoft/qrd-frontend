import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public get<T>(key: string): T | null {
    return <T>localStorage.getItem(key);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}

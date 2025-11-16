import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DuplicateCheckService {
  public findCommon<T extends string | number>(a1: T[], a2: T[]): T[] {
    if (!a1 || !a2) return [];

    const set2 = new Set(a2);
    const result = new Set<T>();

    for (const item of a1) {
      if (set2.has(item)) {
        result.add(item);
      }
    }

    return [...result];
  }
}

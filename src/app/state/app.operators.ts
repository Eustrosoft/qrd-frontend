import { StateOperator } from '@ngxs/store';

export function setRecordKey<T>(key: string | number, value: T): StateOperator<Record<string | number, T>> {
  return (existing: Record<string | number, T>) => ({
    ...existing,
    [key]: value,
  });
}

export function removeRecordKey<T>(key: string | number): StateOperator<Record<string | number, T>> {
  return (existing: Record<string | number, T>) => {
    const { [key]: removed, ...rest } = existing;
    return rest;
  };
}

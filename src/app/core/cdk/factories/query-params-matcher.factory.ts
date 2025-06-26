import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';

export function queryParamsMatcherFactory(requiredParams: string[]): UrlMatcher {
  return (segments: UrlSegment[]): UrlMatchResult | null => {
    if (segments.length > 0) {
      return null;
    }

    const url = new URL(window.location.href);
    const queryParams = url.searchParams;
    const allParamsPresent = requiredParams.every((param) => queryParams.has(param));

    if (allParamsPresent) {
      return { consumed: segments };
    }

    return null;
  };
}

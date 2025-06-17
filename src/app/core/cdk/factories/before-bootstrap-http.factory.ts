import { XhrFactory } from '@angular/common';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';

class BrowserXhr implements XhrFactory {
  public build(): XMLHttpRequest {
    return new XMLHttpRequest();
  }
}
const backend = new HttpXhrBackend(new BrowserXhr());
export const httpClient = new HttpClient(backend);

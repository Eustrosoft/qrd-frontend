/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';

registerLocaleData(ru);
// eslint-disable-next-line no-console
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

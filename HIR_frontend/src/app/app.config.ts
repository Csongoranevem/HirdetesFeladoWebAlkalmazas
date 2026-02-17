import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './interceptors/http.interceptor';
import { ConfirmationService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        ConfirmationService,
        provideHttpClient(withInterceptors([httpInterceptor])),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.my-app-dark'
                }
            }
        })
    ]
};
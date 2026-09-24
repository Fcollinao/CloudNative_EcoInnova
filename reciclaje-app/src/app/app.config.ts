import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { 
  MsalInterceptor, 
  MSAL_INSTANCE, 
  MSAL_INTERCEPTOR_CONFIG, 
  MsalInterceptorConfiguration, 
  MsalService, 
  MsalGuard 
} from '@azure/msal-angular';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      // ID de la aplicación registrada en Azure AD
      clientId: 'ec1ea4fc-cecf-4ca6-9bf0-b89f7379a2b1', 
      authority: 'https://login.microsoftonline.com/1d07937f-fb61-42b5-b010-f7e44723ec84', 
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // Asocia las peticiones al backend local con los scopes requeridos
  protectedResourceMap.set('http://localhost:8080/*', ['user.read']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard
  ]
};

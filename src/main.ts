import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
       // Optionnel mais recommandé pour la compatibilité
    )
  ]
}).catch(err => console.error(err));
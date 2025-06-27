import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

export interface Departement {
  idDepart?: number;
  nomDepart: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  // ✅ Utilise une URL relative pour activer le proxy Angular
  private baseUrl = '/kaddem/departement';

constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {}

  getAllDepartements(): Observable<Departement[]> {
    if (isPlatformServer(this.platformId)) {
    // En mode prerendering (server-side), retourner un mock ou Observable vide
    return of([]);
  }
    console.log('Tentative de connexion à :', `${this.baseUrl}/retrieve-all-departements`);
    return this.http.get<Departement[]>(`${this.baseUrl}/retrieve-all-departements`)
      .pipe(
        catchError(error => {
          console.error('Erreur backend:', error);
          throw error;
        })
      );
  }
}

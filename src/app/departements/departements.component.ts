import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartementService, Departement } from '../services/departement.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-departements',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent implements OnInit {
  departements: Departement[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private departementService: DepartementService) {}

  ngOnInit(): void {
    this.loadDepartements();
  }

  loadDepartements(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.departementService.getAllDepartements()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.departements = data;
        },
        error: (err) => {
          this.errorMessage = 'Échec du chargement des départements. Veuillez réessayer.';
          console.error('Erreur:', err);
        }
      });
  }

  refreshData(): void {
    this.loadDepartements();
  }
// Dans votre component.ts
onDelete(id: any) {
  this.departements = this.departements.filter(d => d.idDepart !== id);
}}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchStateService } from '../../services/search-state.service';
import { Buch } from '../../../../core/models/buch.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="list-container">
      <!-- Ladezustand -->
      @if (stateService.isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Lade Bücher...</p>
        </div>
      }

      <!-- Fehlerzustand -->
      @if (stateService.error()) {
        <div class="error-container">
          <mat-icon>error</mat-icon>
          <span>{{ stateService.error() }}</span>
        </div>
      }

      <!-- Leerzustand -->
      @if (!stateService.isLoading() && !stateService.error() && stateService.hasSearched() && stateService.books().length === 0) {
        <div class="no-results">
          <mat-icon>search_off</mat-icon>
          <h3>Keine Bücher gefunden</h3>
          <p>Bitte versuchen Sie andere Suchkriterien.</p>
        </div>
      }

      <!-- Ergebnisse -->
      @if (!stateService.isLoading() && stateService.books().length > 0) {
        <div class="book-grid">
          @for (buch of stateService.books(); track buch.id) {
            <mat-card class="book-card slide-up">
              <div class="card-header-image">
                 <!-- Art Platzhalter -->
                 <mat-icon class="placeholder-icon">
                    {{ buch.art === 'EPUB' ? 'tablet_mac' : 'menu_book' }}
                 </mat-icon>
              </div>
              <mat-card-header>
                <mat-card-title class="text-truncate" [matTooltip]="buch.titel?.titel || ''">
                  {{ buch.titel?.titel }}
                </mat-card-title>
                <mat-card-subtitle class="text-truncate">
                  {{ buch.titel?.untertitel || buch.isbn }}
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content class="book-content">
                <div class="book-meta">
                  <mat-chip-set>
                    <mat-chip>{{ buch.art }}</mat-chip>
                    @if (buch.lieferbar) {
                      <mat-chip class="available-chip" color="accent" selected>Lieferbar</mat-chip>
                    }
                  </mat-chip-set>
                  
                  <div class="rating-price-row">
                     <div class="rating">
                        <span class="stars">★</span> {{ buch.rating }}
                     </div>
                     <div class="price">
                        {{ buch.preis | currency:'EUR' }}
                     </div>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions align="end">
                <button mat-button color="primary" (click)="showDetails(buch)">
                  DETAILS
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>

        <mat-paginator
          [length]="stateService.totalElements()"
          [pageSize]="stateService.criteria().size"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .list-container {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .loading-container, .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #86868b;
    }
    .error-container {
      background-color: rgba(255, 59, 48, 0.1);
      color: #ff3b30;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .book-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      border: 1px solid rgba(255, 255, 255, 0.6) !important;
      background: white !important;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
      border-radius: 20px !important;
      overflow: hidden;
    }
    .book-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
    }
    .card-header-image {
      height: 160px;
      background: linear-gradient(135deg, #f5f5f7 0%, #e1e1e6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d1d6;
      transition: transform 0.3s ease;
    }
    .book-card:hover .placeholder-icon {
      transform: scale(1.1);
      color: var(--primary-color);
    }
    .book-content {
      flex: 1;
      padding: 24px !important;
    }
    mat-card-header {
      padding: 24px 24px 0 24px !important;
    }
    mat-card-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }
    mat-card-subtitle {
      font-size: 14px;
      color: #86868b;
    }
    .text-truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    .book-meta {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .rating-price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      color: #1d1d1f;
      font-size: 14px;
    }
    .stars { color: #ffc107; }
    .price {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1d1d1f; /* Clean black for price */
      letter-spacing: -0.02em;
    }
    .available-chip {
      background-color: #34c759 !important; /* Apple Green */
      color: white !important;
      font-weight: 500;
    }
    
    mat-card-actions {
      padding: 8px 16px 16px 16px !important;
    }
  `]
})
export class BookListComponent {
  constructor(readonly stateService: SearchStateService, private router: Router) { }

  showDetails(buch: Buch): void {
    this.router.navigate(['/buch', buch.id]);
  }

  onPageChange(event: PageEvent): void {
    this.stateService.setPage(event.pageIndex, event.pageSize);
  }
}

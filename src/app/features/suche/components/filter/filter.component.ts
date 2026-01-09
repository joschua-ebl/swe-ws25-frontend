import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchStateService } from '../../services/search-state.service';
import { BuchArt } from '../../../../core/models/buch.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <div class="filter-container">
      <div class="filter-header">
        <h3>Filter</h3>
        <button mat-icon-button (click)="resetFilters()" matTooltip="Filter zurücksetzen">
          <mat-icon>restart_alt</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <!-- Verfügbarkeit -->
      <div class="filter-section">
        <mat-checkbox
          [ngModel]="stateService.criteria().lieferbar"
          (ngModelChange)="updateLieferbar($event)"
        >
          Nur lieferbar
        </mat-checkbox>
      </div>

      <mat-divider></mat-divider>

      <!-- Bewertungsfilter -->
      <div class="filter-section">
        <h4>Rating</h4>
        <div class="star-rating-filter">
          <button
            mat-button
            class="reset-rating-btn"
            [class.active]="selectedRating() === null"
            (click)="selectRating(null)"
            matTooltip="Alle anzeigen"
          >
            Alle
          </button>
          <div class="stars-container">
            @for (star of [1, 2, 3, 4, 5]; track star) {
              <button
                mat-icon-button
                class="star-btn"
                [class.filled]="star <= (hoveredRating() ?? selectedRating() ?? 0)"
                [class.selected]="selectedRating() !== null && star <= selectedRating()!"
                (mouseenter)="hoveredRating.set(star)"
                (mouseleave)="hoveredRating.set(null)"
                (click)="selectRating(star)"
                [matTooltip]="star + (star === 1 ? ' Stern' : ' Sterne')"
              >
                <mat-icon class="star-icon">
                  {{ star <= (hoveredRating() ?? selectedRating() ?? 0) ? 'star' : 'star_border' }}
                </mat-icon>
              </button>
            }
          </div>
          @if (selectedRating() !== null) {
            <span class="rating-label">{{ selectedRating() }}+ Sterne</span>
          }
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Buchart -->
      <div class="filter-section">
        <h4>Art</h4>
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Buchart</mat-label>
          <mat-select [ngModel]="stateService.criteria().art" (ngModelChange)="updateArt($event)">
            <mat-option [value]="null">Alle</mat-option>
            @for (art of buchArtOptions; track art) {
              <mat-option [value]="art">{{ buchArtLabels[art] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="filter-actions mt-auto">
        <button mat-raised-button color="primary" class="w-100" (click)="applyFilters()">
          <mat-icon>filter_list</mat-icon> Filter anwenden
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .filter-container {
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        height: 100%;
        box-sizing: border-box;
        font-family:
          'Inter',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          sans-serif;
      }
      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .filter-header h3 {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.5px;
        font-family: 'Inter', sans-serif;
      }

      mat-divider {
        border-top-color: rgba(0, 0, 0, 0.06);
      }

      .filter-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .filter-section h4 {
        margin: 0;
        font-size: 13px;
        color: #86868b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Star Rating Styles */
      .star-rating-filter {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .reset-rating-btn {
        align-self: flex-start;
        font-size: 14px;
        color: #86868b;
        padding: 4px 12px;
        min-height: 32px;
        border-radius: 16px;
        transition: all 0.2s ease;
      }
      .reset-rating-btn.active {
        background-color: rgba(0, 122, 255, 0.1);
        color: #007aff;
      }
      .stars-container {
        display: flex;
        gap: 4px;
      }
      .star-btn {
        width: 40px;
        height: 40px;
        transition: transform 0.15s ease;
      }
      .star-btn:hover {
        transform: scale(1.15);
      }
      .star-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #d1d1d6;
        transition: color 0.2s ease;
      }
      .star-btn.filled .star-icon,
      .star-btn.selected .star-icon {
        color: #ffc107;
      }
      .rating-label {
        font-size: 13px;
        color: #1d1d1f;
        font-weight: 500;
      }

      .w-100 {
        width: 100%;
      }
      .mt-auto {
        margin-top: auto;
      }
    `,
  ],
})
export class FilterComponent {
  buchArtOptions = Object.values(BuchArt);

  // Label Mapping
  buchArtLabels: Record<BuchArt, string> = {
    [BuchArt.EPUB]: 'ePub',
    [BuchArt.HARDCOVER]: 'Hardcover',
    [BuchArt.PAPERBACK]: 'Paperback',
  };

  selectedRating = signal<number | null>(null);
  hoveredRating = signal<number | null>(null);

  constructor(readonly stateService: SearchStateService) {
    const initialRating = this.stateService.criteria().rating;
    if (initialRating !== undefined) {
      this.selectedRating.set(initialRating);
    }
  }

  updateLieferbar(lieferbar: boolean): void {
    this.stateService.updateCriteria({ lieferbar: lieferbar || undefined });
  }

  selectRating(rating: number | null): void {
    this.selectedRating.set(rating);
    this.stateService.updateCriteria({ rating: rating ?? undefined });
  }

  updateArt(art: BuchArt | null): void {
    this.stateService.updateCriteria({ art: art ?? undefined });
  }

  applyFilters(): void {
    this.stateService.search();
  }

  resetFilters(): void {
    this.selectedRating.set(null);
    this.stateService.reset();
  }
}

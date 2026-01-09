import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="searchbar-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Suche nach Titel</mat-label>
        <input
          matInput
          [ngModel]="stateService.criteria().titel"
          (ngModelChange)="updateTitel($event)"
          (keydown.enter)="search()"
          placeholder="Titel eingeben..."
        />
        <mat-icon matPrefix>search</mat-icon>
        @if (stateService.criteria().titel) {
          <button mat-icon-button matSuffix (click)="clearTitel()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>ISBN</mat-label>
        <input
          matInput
          [ngModel]="stateService.criteria().isbn"
          (ngModelChange)="updateIsbn($event)"
          (keydown.enter)="search()"
          placeholder="ISBN eingeben..."
        />
        <mat-icon matPrefix>qr_code</mat-icon>
      </mat-form-field>

      <button mat-raised-button color="primary" class="search-button" (click)="search()">
        Suchen
      </button>
    </div>
  `,
  styles: [
    `
      .searchbar-container {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 8px 24px;
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 20px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.4);
        margin-bottom: 32px;
        height: 64px; /* Fixed height for consistency */
        box-sizing: border-box;
      }

      .search-field {
        flex: 1;
        min-width: 200px;
        height: 100%;
        display: flex;
        align-items: center;
      }

      /* Remove default material spacing reservations */
      ::ng-deep .search-field .mdc-text-field {
        background-color: transparent !important;
        padding: 0 !important;
        height: 100% !important;
        display: flex;
        align-items: center;
      }

      ::ng-deep .search-field .mdc-text-field--outlined .mdc-notched-outline {
        display: none !important;
      }

      ::ng-deep .search-field .mdc-text-field__input {
        padding: 0 !important;
        height: 100% !important;
        font-size: 16px;
        color: #1d1d1f;
      }

      /* Hide the floating label to keep it clean - puristic look */
      ::ng-deep .search-field .mdc-floating-label {
        display: none !important;
      }

      ::ng-deep .search-field .mat-mdc-form-field-icon-prefix {
        padding: 0 12px 0 0;
        color: #86868b;
        align-self: center;
      }

      /* Remove bottom padding space reserved for hints/errors */
      ::ng-deep .search-field .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .search-button {
        height: 40px;
        border-radius: 20px;
        padding: 0 24px;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
      }

      @media (max-width: 600px) {
        .searchbar-container {
          flex-direction: column;
          align-items: stretch;
          padding: 16px;
          gap: 16px;
          height: auto;
        }
        .search-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class SearchbarComponent {
  constructor(readonly stateService: SearchStateService) {}

  updateTitel(titel: string): void {
    this.stateService.updateCriteria({ titel });
  }

  updateIsbn(isbn: string): void {
    this.stateService.updateCriteria({ isbn });
  }

  clearTitel(): void {
    this.stateService.updateCriteria({ titel: '' });
  }

  search(): void {
    this.stateService.search();
  }
}

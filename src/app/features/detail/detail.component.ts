import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BuchService } from '../../core/services/buch.service';
import { Buch } from '../../core/models/buch.model';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatListModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
    @Input() id!: string;

    buch = signal<Buch | null>(null);

    constructor(
        private readonly router: Router,
        readonly buchService: BuchService,
    ) { }

    ngOnInit(): void {
        const buchId = parseInt(this.id, 10);
        if (isNaN(buchId)) {
            this.router.navigate(['/suche']);
            return;
        }

        this.buchService.findById(buchId).subscribe({
            next: buch => {
                this.buch.set(buch);
            },
            error: () => {
                // Fehlerbehandlung im Service
            },
        });
    }

    zurueck(): void {
        this.router.navigate(['/suche']);
    }

    getRatingStars(rating: number): string {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    formatPreis(preis: number): string {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(preis);
    }

    formatRabatt(rabatt: number): string {
        return new Intl.NumberFormat('de-DE', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(rabatt);
    }

    formatDatum(datum: string | undefined): string {
        if (!datum) return '-';
        return new Date(datum).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
}

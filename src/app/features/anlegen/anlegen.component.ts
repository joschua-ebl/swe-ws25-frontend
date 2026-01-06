import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { BuchService } from '../../core/services/buch.service';
import { BuchArt, BuchInput } from '../../core/models/buch.model';

// Validiert ISBN-13
function isbnValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
        return null;
    }

    // Eingabe normalisieren
    const isbn = value.replace(/[-\s]/g, '');

    // Muss 13 Ziffern haben
    if (!/^\d{13}$/.test(isbn)) {
        return { invalidIsbn: 'ISBN muss 13 Ziffern haben' };
    }

    // Prüfsumme validieren
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(isbn[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;

    if (checkDigit !== parseInt(isbn[12], 10)) {
        return { invalidIsbn: 'Ungültige ISBN-Prüfsumme' };
    }

    return null;
}

@Component({
    selector: 'app-anlegen',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSliderModule,
    ],
    templateUrl: './anlegen.component.html',
    styleUrl: './anlegen.component.css',
})
export class AnlegenComponent {
    buchForm: FormGroup;
    isSubmitting = signal(false);
    buchArtOptions = Object.values(BuchArt);

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,
        readonly buchService: BuchService,
    ) {
        this.buchForm = this.fb.group({
            isbn: ['', [Validators.required, isbnValidator]],
            titel: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            untertitel: ['', [Validators.maxLength(100)]],
            rating: [3, [Validators.required, Validators.min(0), Validators.max(5)]],
            art: [BuchArt.PAPERBACK, [Validators.required]],
            preis: [null, [Validators.required, Validators.min(0.01), Validators.max(9999.99)]],
            rabatt: [0, [Validators.min(0), Validators.max(1)]],
            lieferbar: [true],
            datum: [null],
            homepage: ['', [Validators.pattern(/^https?:\/\/.+/)]],
            schlagwoerter: [''],
        });
    }

    onSubmit(): void {
        if (this.buchForm.invalid) {
            this.buchForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.buchService.clearError();

        const formValue = this.buchForm.value;

        // Komma-separierten String in Array umwandeln
        const schlagwoerter = formValue.schlagwoerter
            ? formValue.schlagwoerter
                .split(',')
                .map((s: string) => s.trim().toUpperCase())
                .filter((s: string) => s.length > 0)
            : [];

        // Datum formatieren
        let datum: string | undefined;
        if (formValue.datum) {
            const d = new Date(formValue.datum);
            datum = d.toISOString().split('T')[0];
        }

        const buchInput: BuchInput = {
            isbn: formValue.isbn.replace(/[-\s]/g, ''),
            rating: formValue.rating,
            art: formValue.art,
            preis: formValue.preis,
            rabatt: formValue.rabatt || 0,
            lieferbar: formValue.lieferbar,
            datum,
            homepage: formValue.homepage || undefined,
            schlagwoerter,
            titel: {
                titel: formValue.titel,
                untertitel: formValue.untertitel || undefined,
            },
        };

        this.buchService.create(buchInput).subscribe({
            next: id => {
                this.isSubmitting.set(false);
                this.snackBar.open('Buch erfolgreich angelegt!', 'Schließen', {
                    duration: 5000,
                    panelClass: ['success-snackbar'],
                });
                this.router.navigate(['/buch', id]);
            },
            error: () => {
                this.isSubmitting.set(false);
                this.snackBar.open('Fehler beim Anlegen des Buches', 'Schließen', {
                    duration: 5000,
                    panelClass: ['error-snackbar'],
                });
            },
        });
    }

    abbrechen(): void {
        this.router.navigate(['/suche']);
    }

    getErrorMessage(field: string): string {
        const control = this.buchForm.get(field);
        if (!control) return '';

        if (control.hasError('required')) {
            return 'Dieses Feld ist erforderlich';
        }
        if (control.hasError('minlength')) {
            const minLength = control.getError('minlength').requiredLength;
            return `Mindestens ${minLength} Zeichen erforderlich`;
        }
        if (control.hasError('maxlength')) {
            const maxLength = control.getError('maxlength').requiredLength;
            return `Maximal ${maxLength} Zeichen erlaubt`;
        }
        if (control.hasError('min')) {
            const min = control.getError('min').min;
            return `Wert muss mindestens ${min} sein`;
        }
        if (control.hasError('max')) {
            const max = control.getError('max').max;
            return `Wert darf maximal ${max} sein`;
        }
        if (control.hasError('invalidIsbn')) {
            return control.getError('invalidIsbn');
        }
        if (control.hasError('pattern')) {
            return 'Ungültiges Format (muss mit http:// oder https:// beginnen)';
        }
        return '';
    }

    formatRatingLabel(value: number): string {
        return `${value}`;
    }
}

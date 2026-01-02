import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = signal(false);
    hidePassword = signal(true);

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        readonly authService: AuthService,
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(4)]],
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.authService.clearError();

        const { username, password } = this.loginForm.value;

        this.authService.login(username, password).subscribe({
            next: success => {
                this.isLoading.set(false);
                if (success) {
                    this.router.navigate(['/suche']);
                }
            },
            error: () => {
                this.isLoading.set(false);
            },
        });
    }

    togglePasswordVisibility(): void {
        this.hidePassword.update(v => !v);
    }

    getErrorMessage(field: string): string {
        const control = this.loginForm.get(field);
        if (control?.hasError('required')) {
            return `${field === 'username' ? 'Benutzername' : 'Passwort'} ist erforderlich`;
        }
        if (control?.hasError('minlength')) {
            return 'Mindestens 4 Zeichen erforderlich';
        }
        return '';
    }
}

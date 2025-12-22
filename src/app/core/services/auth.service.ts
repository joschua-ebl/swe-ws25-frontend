import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    token_type: string;
}

export interface LoginError {
    error: string;
    error_description?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly tokenKey = 'access_token';
    private readonly usernameKey = 'username';

    // Signals für reaktiven State
    private readonly _isLoggedIn = signal(this.hasValidToken());
    private readonly _username = signal(this.getStoredUsername());
    private readonly _loginError = signal<string | null>(null);

    // Computed values
    readonly isLoggedIn = computed(() => this._isLoggedIn());
    readonly username = computed(() => this._username());
    readonly loginError = computed(() => this._loginError());

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) {
        // Token beim Start prüfen
        this.checkTokenValidity();
    }

    login(username: string, password: string): Observable<boolean> {
        const tokenUrl = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

        const body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('client_id', environment.keycloak.clientId);
        body.set('username', username);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        this._loginError.set(null);

        return this.http.post<TokenResponse>(tokenUrl, body.toString(), { headers }).pipe(
            tap(response => {
                this.storeToken(response.access_token);
                this.storeUsername(username);
                this._isLoggedIn.set(true);
                this._username.set(username);
            }),
            map(() => true),
            catchError((error: { error?: LoginError }) => {
                const errorMessage =
                    error.error?.error_description || error.error?.error || 'Login fehlgeschlagen';
                this._loginError.set(errorMessage);
                return of(false);
            }),
        );
    }

    logout(): void {
        this.clearToken();
        this._isLoggedIn.set(false);
        this._username.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem(this.tokenKey);
    }

    clearError(): void {
        this._loginError.set(null);
    }

    private storeToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    private storeUsername(username: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.usernameKey, username);
        }
    }

    private clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.usernameKey);
        }
    }

    private hasValidToken(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        // JWT Expiration prüfen
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // in Millisekunden
            return Date.now() < exp;
        } catch {
            return false;
        }
    }

    hasRole(role: string): boolean {
        const roles = this.getRoles();
        return roles.includes(role);
    }

    private getRoles(): string[] {
        const token = this.getToken();
        if (!token) return [];

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Keycloak: realm_access.roles oder resource_access.{client}.roles
            // Hier prüfen wir realm_access für 'admin' Rolle
            if (payload.realm_access && Array.isArray(payload.realm_access.roles)) {
                return payload.realm_access.roles;
            }
            return [];
        } catch {
            return [];
        }
    }

    private getStoredUsername(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem(this.usernameKey);
    }

    private checkTokenValidity(): void {
        if (!this.hasValidToken()) {
            this.clearToken();
            this._isLoggedIn.set(false);
            this._username.set(null);
        }
    }
}

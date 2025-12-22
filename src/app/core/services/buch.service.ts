import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import {
    Buch,
    BuchInput,
    BuchPage,
    BuchSuchparameter,
    BuchUpdate,
} from '../models/buch.model';

@Injectable({
    providedIn: 'root',
})
export class BuchService {
    private readonly apiUrl = `${environment.apiUrl}/rest`;

    // Loading-State Signals
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    constructor(private readonly http: HttpClient) { }

    findById(id: number): Observable<Buch> {
        this.isLoading.set(true);
        this.error.set(null);

        return this.http.get<Buch>(`${this.apiUrl}/${id}`).pipe(
            map(buch => {
                this.isLoading.set(false);
                return buch;
            }),
            catchError(error => this.handleError(error)),
        );
    }

    find(params: BuchSuchparameter = {}): Observable<BuchPage> {
        this.isLoading.set(true);
        this.error.set(null);

        let httpParams = new HttpParams();

        // Suchparameter hinzufügen
        if (params.isbn) {
            httpParams = httpParams.set('isbn', params.isbn);
        }
        if (params.rating !== undefined) {
            httpParams = httpParams.set('rating', params.rating.toString());
        }
        if (params.art) {
            httpParams = httpParams.set('art', params.art);
        }
        if (params.lieferbar !== undefined) {
            httpParams = httpParams.set('lieferbar', params.lieferbar.toString());
        }
        if (params.titel) {
            httpParams = httpParams.set('titel', params.titel);
        }
        if (params.javascript !== undefined) {
            httpParams = httpParams.set('javascript', params.javascript.toString());
        }
        if (params.typescript !== undefined) {
            httpParams = httpParams.set('typescript', params.typescript.toString());
        }

        // Pagination
        if (params.page !== undefined) {
            httpParams = httpParams.set('page', params.page.toString());
        }
        if (params.size !== undefined) {
            httpParams = httpParams.set('size', params.size.toString());
        }

        return this.http.get<BuchPage>(this.apiUrl, { params: httpParams }).pipe(
            map(response => {
                this.isLoading.set(false);
                return response;
            }),
            catchError(error => this.handleError(error)),
        );
    }

    create(buch: BuchInput): Observable<string> {
        this.isLoading.set(true);
        this.error.set(null);

        return this.http
            .post(this.apiUrl, buch, {
                observe: 'response',
                responseType: 'text',
            })
            .pipe(
                map(response => {
                    this.isLoading.set(false);
                    // Location-Header enthält die URL des neuen Buchs
                    const location = response.headers.get('Location');
                    if (location) {
                        // ID aus Location extrahieren
                        const id = location.split('/').pop();
                        return id || '';
                    }
                    return '';
                }),
                catchError(error => this.handleError(error)),
            );
    }

    update(id: number, buch: BuchUpdate, version: number): Observable<number> {
        this.isLoading.set(true);
        this.error.set(null);

        const headers = new HttpHeaders({
            'If-Match': `"${version}"`,
        });

        return this.http
            .put(`${this.apiUrl}/${id}`, buch, {
                headers,
                observe: 'response',
                responseType: 'text',
            })
            .pipe(
                map(response => {
                    this.isLoading.set(false);
                    // ETag hat die neue Version
                    const etag = response.headers.get('ETag');
                    if (etag) {
                        return parseInt(etag.replace(/"/g, ''), 10);
                    }
                    return version + 1;
                }),
                catchError(error => this.handleError(error)),
            );
    }

    delete(id: number): Observable<void> {
        this.isLoading.set(true);
        this.error.set(null);

        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            map(() => {
                this.isLoading.set(false);
            }),
            catchError(error => this.handleError(error)),
        );
    }

    count(): Observable<number> {
        return this.http
            .get<{ count: number }>(this.apiUrl, {
                params: new HttpParams().set('only', 'count'),
            })
            .pipe(
                map(response => response.count),
                catchError(error => this.handleError(error)),
            );
    }

    clearError(): void {
        this.error.set(null);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        this.isLoading.set(false);

        let errorMessage = 'Ein unbekannter Fehler ist aufgetreten';

        if (error.status === 0) {
            errorMessage = 'Server nicht erreichbar. Bitte prüfen Sie die Verbindung.';
        } else if (error.status === 401) {
            errorMessage = 'Nicht autorisiert. Bitte melden Sie sich an.';
        } else if (error.status === 403) {
            errorMessage = 'Keine Berechtigung für diese Aktion.';
        } else if (error.status === 404) {
            errorMessage = 'Buch nicht gefunden.';
        } else if (error.status === 400) {
            if (typeof error.error === 'object' && error.error?.message) {
                const messages = Array.isArray(error.error.message)
                    ? error.error.message.join(', ')
                    : error.error.message;
                errorMessage = `Validierungsfehler: ${messages}`;
            } else {
                errorMessage = 'Ungültige Anfrage.';
            }
        } else if (error.status === 412) {
            errorMessage = 'Version stimmt nicht überein. Das Buch wurde zwischenzeitlich geändert.';
        } else if (error.status === 428) {
            errorMessage = 'Version (If-Match Header) fehlt.';
        }

        this.error.set(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}

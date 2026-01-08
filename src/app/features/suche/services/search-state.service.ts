import { Injectable, computed, signal } from '@angular/core';
import { Buch, BuchPage, BuchSuchparameter, BuchArt } from '../../../core/models/buch.model';
import { BuchService } from '../../../core/services/buch.service';

export interface SearchState {
    criteria: BuchSuchparameter;
    books: Buch[];
    totalElements: number;
    isLoading: boolean;
    error: string | null;
    hasSearched: boolean;
}

const INITIAL_CRITERIA: BuchSuchparameter = {
    page: 0,
    size: 10,
    javascript: false,
    typescript: false,
    lieferbar: undefined,
    rating: undefined,
    art: undefined,
    titel: '',
    isbn: ''
};

@Injectable({
    providedIn: 'root'
})
export class SearchStateService {
    // State Signals
    private readonly _criteria = signal<BuchSuchparameter>(INITIAL_CRITERIA);
    private readonly _books = signal<Buch[]>([]);
    private readonly _totalElements = signal<number>(0);
    private readonly _isLoading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);
    private readonly _hasSearched = signal<boolean>(false);

    // Computed State
    readonly criteria = computed(() => this._criteria());
    readonly books = computed(() => this._books());
    readonly totalElements = computed(() => this._totalElements());
    readonly isLoading = computed(() => this._isLoading());
    readonly error = computed(() => this._error());
    readonly hasSearched = computed(() => this._hasSearched());

    constructor(private readonly buchService: BuchService) { }

    search(): void {
        this._isLoading.set(true);
        this._error.set(null);
        this._hasSearched.set(true);

        this.buchService.find(this._criteria()).subscribe({
            next: (response: BuchPage) => {
                this._books.set(response.content || []);
                this._totalElements.set(response.page.totalElements);
                this._isLoading.set(false);
            },
            error: (err: Error) => {
                this._books.set([]);
                this._totalElements.set(0);
                this._error.set(err.message || 'Ein Fehler ist aufgetreten');
                this._isLoading.set(false);
            }
        });
    }

    updateCriteria(partialCriteria: Partial<BuchSuchparameter>): void {
        this._criteria.update(current => ({ ...current, ...partialCriteria }));
    }

    setPage(pageIndex: number, pageSize: number): void {
        this.updateCriteria({ page: pageIndex, size: pageSize });
        this.search();
    }

    reset(): void {
        this._criteria.set(INITIAL_CRITERIA);
        this._error.set(null);
        this.search();
    }
}

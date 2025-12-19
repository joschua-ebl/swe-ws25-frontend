/**
 * Buchart Enum - entspricht dem Backend-Enum
 */
export enum BuchArt {
    EPUB = 'EPUB',
    HARDCOVER = 'HARDCOVER',
    PAPERBACK = 'PAPERBACK',
}

/**
 * Titel Model
 */
export interface Titel {
    id?: number;
    titel: string;
    untertitel?: string;
}

/**
 * Abbildung Model
 */
export interface Abbildung {
    id?: number;
    beschriftung: string;
    contentType: string;
}

/**
 * Buch Model - Hauptentität
 */
export interface Buch {
    id: number;
    version: number;
    isbn: string;
    rating: number;
    art?: BuchArt;
    preis: number;
    rabatt: number;
    lieferbar: boolean;
    datum?: string;
    homepage?: string;
    schlagwoerter?: string[];
    erzeugt?: string;
    aktualisiert?: string;
    titel?: Titel;
    abbildungen?: Abbildung[];
}

/**
 * Titel Input DTO für Create/Update
 */
export interface TitelInput {
    titel: string;
    untertitel?: string;
}

/**
 * Abbildung Input DTO für Create/Update
 */
export interface AbbildungInput {
    beschriftung: string;
    contentType: string;
}

/**
 * Buch Input DTO für Create
 */
export interface BuchInput {
    isbn: string;
    rating: number;
    art?: BuchArt;
    preis: number;
    rabatt?: number;
    lieferbar?: boolean;
    datum?: string;
    homepage?: string;
    schlagwoerter?: string[];
    titel: TitelInput;
    abbildungen?: AbbildungInput[];
}

/**
 * Buch Update DTO (ohne Relationen)
 */
export interface BuchUpdate {
    isbn: string;
    rating: number;
    art?: BuchArt;
    preis: number;
    rabatt?: number;
    lieferbar?: boolean;
    datum?: string;
    homepage?: string;
    schlagwoerter?: string[];
}

/**
 * Suchparameter für die Buch-Suche
 */
export interface BuchSuchparameter {
    isbn?: string;
    rating?: number;
    art?: BuchArt;
    preis?: number;
    rabatt?: number;
    lieferbar?: boolean;
    datum?: string;
    homepage?: string;
    javascript?: boolean;
    typescript?: boolean;
    titel?: string;
    page?: number;
    size?: number;
}

/**
 * Pagination Metadaten
 */
export interface PageMetadata {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

/**
 * Page Response für paginierte Ergebnisse
 */
export interface BuchPage {
    content: Buch[];
    page: PageMetadata;
}

/**
 * Fehler-Response vom Backend
 */
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error?: string;
}

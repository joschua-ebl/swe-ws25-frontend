import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchStateService } from './services/search-state.service';
import { FilterComponent } from './components/filter/filter.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-suche',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FilterComponent,
        SearchbarComponent,
        BookListComponent
    ],
    templateUrl: './suche.component.html',
    styleUrl: './suche.component.css',
    providers: [SearchStateService]
})
export class SucheComponent implements OnInit {
    @ViewChild('sidenav') sidenav!: MatSidenav;

    isMobile = signal(false);

    constructor(
        private breakpointObserver: BreakpointObserver,
        private stateService: SearchStateService
    ) {
        this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.TabletPortrait
        ]).subscribe(result => {
            this.isMobile.set(result.matches);
        });
    }

    ngOnInit(): void {
        // Initialsuche falls nötig
        if (!this.stateService.hasSearched()) {
            this.stateService.search();
        }
    }

    toggleSidenav(): void {
        this.sidenav.toggle();
    }
}

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Dynamische Route - kein Prerendering
    path: 'buch/:id',
    renderMode: RenderMode.Client,
  },
  {
    // Anlegen braucht Auth - kein Prerendering
    path: 'buch/neu',
    renderMode: RenderMode.Client,
  },
  {
    // Login - kein Prerendering
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    // Suche - Client-seitig wegen API-Calls
    path: 'suche',
    renderMode: RenderMode.Client,
  },
  {
    // Alle anderen Routen
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

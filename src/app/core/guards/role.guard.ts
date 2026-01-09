import { inject } from '@angular/core';
import { type CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Verhindert Laden der Route ohne passende Rolle
export const roleGuard: CanMatchFn = (route: Route, _segments: UrlSegment[]) => {
  const authService = inject(AuthService);

  const expectedRole = route.data?.['role'] as string;

  if (!expectedRole) {
    console.warn('RoleGuard used but no role defined in route data');
    return true;
  }

  if (authService.isLoggedIn() && authService.hasRole(expectedRole)) {
    return true;
  }

  // 404 simulieren für unautorisierte Nutzer
  return false;
};

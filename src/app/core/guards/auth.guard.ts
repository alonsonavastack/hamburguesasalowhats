import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Garantiza sesión activa directa con credenciales configuradas
  const user = await auth.ensureAuthenticated();
  if (!user && !environment.autoLoginAdmin) {
    return router.createUrlTree(['/admin/login']);
  }

  const role = await auth.waitForRole();
  if (role === 'inactivo' && !environment.autoLoginAdmin) {
    await auth.logout();
    return router.createUrlTree(['/admin/login']);
  }

  return true;
};

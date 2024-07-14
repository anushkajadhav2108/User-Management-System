import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './Service/auth.service'; 

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (localStorage.getItem('user1'))
  {
    return true; 
  }else {
    return router.createUrlTree(['login']); 
  }
};

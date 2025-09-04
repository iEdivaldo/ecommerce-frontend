import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(AuthService);
    if (!auth.autenticado()) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

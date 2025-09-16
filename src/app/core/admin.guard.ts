import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AdminGuard {

    constructor(private auth: AuthService, private router: Router) {}

    canActivate(): boolean {
        // Lógica para verificar se o usuário é um administrador
        if (!this.auth.usuarioTemPermissao()) {
            this.router.navigate(['/produtos']);
            return false;
        }
        return true;
    }
}
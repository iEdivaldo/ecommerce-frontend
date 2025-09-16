import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = environment.apiUrl;
    token = signal<string | null>(localStorage.getItem('token'));
    router = inject(Router);
    usuario = signal<any | null>(JSON.parse(localStorage.getItem('usuario') || 'null'));
    constructor(private http: HttpClient) {}
 
    registrar(dados: { nome: string; email: string; senha: string; perfil?: 'CLIENTE'|'ADMINISTRADOR'}) {
        return this.http.post<any>(`${this.base}/autenticacao/registrar`, dados);
    }

    entrar(dados: {  email: string; senha: string }) {
        return this.http.post<any>(`${this.base}/autenticacao/login`, dados);
    }

    logout() {
        this.http.get(`${this.base}/autenticacao/logout`, {}).subscribe(() => {
            this.sair();
        });
    }

    salvarToken(t: string, usuario?: any) {
        this.token.set(t);
        localStorage.setItem('token', t);
        if (usuario) {
            this.usuario.set(usuario);
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }

    usuarioTemPermissao(): boolean {
        return this.usuario() && this.usuario().perfil.includes("ADMINISTRADOR");
    }

    sair() {
        this.token.set(null);
        this.usuario.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.router.navigate(['/catalogo']);
    }

    limparTudo() {
        this.token.set(null);
        this.usuario.set(null);
        localStorage.clear();
    }

    autenticado() {
        return !!this.token();
    }
}
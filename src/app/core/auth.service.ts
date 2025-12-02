import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = environment.apiUrl;
    token = signal<string | null>(null);
    router = inject(Router);
    usuario = signal<any | null>(null);

    constructor(private http: HttpClient) {
        const tokenSalvo = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');
        
        if (tokenSalvo && usuarioSalvo) {
            try {
                this.token.set(tokenSalvo);
                this.usuario.set(JSON.parse(usuarioSalvo));
            } catch (e) {
                this.limparTudo();
            }
        } else {
            this.limparTudo();
        }
    }
 
    registrar(dados: { nome: string; email: string; senha: string; perfil?: 'CLIENTE'|'ADMINISTRADOR'}) {
        return this.http.post<any>(`${this.base}/autenticacao/registrar`, dados);
    }

    entrar(dados: {  email: string; senha: string }) {
        return this.http.post<any>(`${this.base}/autenticacao/login`, dados);
    }

    logout() {
        this.sair();
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
        const user = this.usuario();
        return user && user.perfil === "ADMINISTRADOR" || user && user.perfil === "SUPER_ADMIN";
        //return this.usuario() && this.usuario().perfil.includes("ADMINISTRADOR");
    }

    sair() {
        this.limparTudo();
        this.router.navigate(['/produtos']);
    }

    limparTudo() {
        this.token.set(null);
        this.usuario.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    autenticado() {
        return !!this.token();
    }
}
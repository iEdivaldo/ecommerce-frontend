import { Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = environment.apiUrl;
    token = signal<string | null>(localStorage.getItem('token'));
    //usuario = signal<any | null>(null);
    usuario = signal<any | null>(JSON.parse(localStorage.getItem('usuario') || 'null'));
    constructor(private http: HttpClient) {}
 
    registrar(dados: { nome: string; email: string; senha: string; perfil?: 'CLIENTE'|'ADMINISTRADOR'}) {
        return this.http.post<any>(`${this.base}/autenticacao/registrar`, dados);
    }

    entrar(dados: {  email: string; senha: string }) {
        return this.http.post<any>(`${this.base}/autenticacao/login`, dados);
    }

    salvarToken(t: string, usuario?: any) {
        this.token.set(t);
        localStorage.setItem('token', t);
        if (usuario) {
            this.usuario.set(usuario);
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }

    sair() {
        this.token.set(null);
        localStorage.removeItem('token');
        this.usuario.set(null);
    }

    autenticado() {
        return !!this.token();
    }
}
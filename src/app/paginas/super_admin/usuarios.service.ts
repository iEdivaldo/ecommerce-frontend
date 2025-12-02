import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UsuariosService {
    private http = inject(HttpClient);

    carregarUsuarios(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/super_admin/usuarios`);
    }

    adicionarUsuario(usuario: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/super_admin/usuarios`, usuario);
    }

    editarUsuario(id: number, usuario: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/super_admin/usuario/${id}`, usuario);
    }

    excluirUsuario(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/super_admin/usuario/${id}`);
    }
}
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
}
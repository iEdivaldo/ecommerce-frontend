import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfiguracoesRequest } from './configuracoes-request';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracoesUsuarioService {

    private http = inject(HttpClient);

    salvar(configuracoes: ConfiguracoesRequest): Observable<any> {
        return this.http.put(`${environment.apiUrl}/configuracoes`, configuracoes);
    }
}
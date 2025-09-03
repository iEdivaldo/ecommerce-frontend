import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class EnderecoService {
    private base = environment.apiUrl;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get(`${this.base}/enderecos`);
    }

    criar(payload: any) {
        return this.http.post(`${this.base}/enderecos`, payload);
    }

    atualizar(id: string, payload: any) {
        return this.http.put(`${this.base}/enderecos/${id}`, payload);
    }

    remover(id: string) {
        return this.http.delete(`${this.base}/enderecos/${id}`);
    }
}
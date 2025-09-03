import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private base = environment.apiUrl;

    // catalogo
    listarProdutos(params: any = {}) {
        return this.http.get(`${this.base}/produtos`, { params });
    }

    obterProduto(id: string) {
        return this.http.get(`${this.base}/produtos/${id}`);
    }


    // admin
    criarProduto(payload: any) {
        return this.http.post(`${this.base}/administracao/produtos`, payload);
    }
}
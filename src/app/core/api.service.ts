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

    listarProdutosCategoria(categoriaId: any) {
        return this.http.get(`${this.base}/produtos/categoria/${categoriaId}`);
    }

    obterProduto(id: string) {
        return this.http.get(`${this.base}/produtos/${id}`);
    }

    // admin Produtos
    criarProduto(payload: any) {
        return this.http.post(`${this.base}/administracao/produtos`, payload);
    }

    listarProdutosAdministracao( params: any = {}) {
        return this.http.get(`${this.base}/administracao/produtos`, { params });
    }

    editarProduto(id: number, payload: any) {
        return this.http.put(`${this.base}/administracao/produtos/${id}`, payload);
    }

    excluirProduto(id: number) {
        return this.http.delete(`${this.base}/administracao/produtos/${id}`);
    }

    // admin Categorias
    criarCategoria(payload: any) {
        return this.http.post(`${this.base}/administracao/categorias`, payload);
    }

    listarCategorias(params: any = {}) {
        return this.http.get(`${this.base}/administracao/categorias`, { params });
    }

    editarCategoria(id: number, payload: any) {
        return this.http.put(`${this.base}/administracao/categorias/${id}`, payload);
    }

    excluirCategoria(id: number) {
        return this.http.delete(`${this.base}/administracao/categorias/${id}`);
    }
}
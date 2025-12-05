import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/internal/Observable";

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private base = environment.apiUrl;

    // catalogo
    listarProdutos(params: any = {}) {
        return this.http.get(`${this.base}/produtos`, { params });
    }

    listarProdutosPorUsuario(usuarioId: number) {
        return this.http.get(`${this.base}/administracao/produtos/usuario/${usuarioId}`);
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

    // notificacoes
    excluirProdutoComJustificativa(id: number, justificativa: string): Observable<any> {
        return this.http.delete(`${this.base}/super_admin/produto/${id}`, {
            body: { justificativa }
        });
    }

    listarNotificacoes(): Observable<any> {
        return this.http.get(`${this.base}/notificacoes`);
    }

    listarNotificacoesNaoLidas(): Observable<any> {
        return this.http.get(`${this.base}/notificacoes/nao-lidas`);
    }

    contarNotificacoesNaoLidas(): Observable<number> {
        return this.http.get<number>(`${this.base}/notificacoes/contar-nao-lidas`);
    }

    marcarNotificacaoComoLida(id: number): Observable<any> {
        return this.http.put(`${this.base}/notificacoes/${id}/marcar-como-lida`, {});
    }

    marcarTodasNotificacoesComoLidas(): Observable<any> {
        return this.http.put(`${this.base}/notificacoes/marcar-todas-como-lidas`, {});
    }
}
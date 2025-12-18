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

    // publico
    listarCategoriasPublicas(params: any = {}) {
        return this.http.get(`${this.base}/produtos/categorias`, { params });
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

    // Pedidos
    criarPedido(dto: any): Observable<any> {
        return this.http.post(`${this.base}/pedidos`, dto);
    }

    listarPedidos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/pedidos/meus-pedidos`);
    }

    listarMinhasVendas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/pedidos/minhas-vendas`);
    }

    buscarPedido(id: number): Observable<any> {
        return this.http.get<any>(`${this.base}/pedidos/${id}`);
    }

    atualizarStatusPedido(id: number, novoStatus: string): Observable<any> {
        return this.http.put(`${this.base}/pedidos/${id}/status`, `"${novoStatus}"`, {
            headers: { 'Content-Type': 'application/json' }});
    }

    // Endereços
    listarEnderecos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/enderecos`);
    }

    criarEndereco(payload: any): Observable<any> {
        return this.http.post(`${this.base}/enderecos`, payload);
    }

    atualizarEndereco(id: number, payload: any): Observable<any> {
        return this.http.put(`${this.base}/enderecos/${id}`, payload);
    }

    excluirEndereco(id: number): Observable<any> {
        return this.http.delete(`${this.base}/enderecos/${id}`);
    }

}
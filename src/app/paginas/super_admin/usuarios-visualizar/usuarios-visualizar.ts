import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { AuthService } from "../../../core/auth.service";
import { FormsModule } from "@angular/forms";

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios-visualizar',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios-visualizar.html',
})
export class PaginaUsuariosVisualizarSuperAdmin {
    // Lógica para visualizar os produtos do usuário pode ser adicionada aqui
    produtosDoUsuario: any[] = [];
    produtosService = inject(ApiService);
    route = inject(ActivatedRoute)
    cdr = inject(ChangeDetectorRef);
    usuarioId: number = 0;
    produtoIdParaExcluir: number = 0;
    modalInstance: any;
    justificativaExclusao: string = '';

    ngOnInit() {
        this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
        this.visualizarProdutos();
    }

    visualizarProdutos() {
        // Lógica para visualizar os produtos do usuário
        this.produtosService.listarProdutosPorUsuario(this.usuarioId).subscribe((produtos: any) => {
            this.produtosDoUsuario = produtos;
            this.cdr.detectChanges();
            console.log('Produtos do usuário: ...', this.produtosDoUsuario);
        });
    }

    abrirModalExclusao(produtoId: number) {
        this.produtoIdParaExcluir = produtoId;
        this.justificativaExclusao = '';
        const modalElement = document.getElementById('modalJustificativa');
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.modalInstance.show();
    }

    confirmarExclusao() {
        if (!this.justificativaExclusao.trim()) {
            alert('Por favor, forneça uma justificativa.');
            return;
        }

        this.produtosService.excluirProduto(this.produtoIdParaExcluir).subscribe(() => {
            this.modalInstance.hide();
            this.visualizarProdutos();
        });
    }
}
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../core/auth.service";
import { ApiService } from "../../../core/api.service";

@Component({
  selector: 'admin-categorias',
  templateUrl: './admin-categorias.html',
  imports: [CommonModule, FormsModule]
})
export class AdminCategorias {
    private autenticacao = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);
    private api = inject(ApiService);
    usuarioAtual = this.autenticacao.usuario;
    form = {
        nome: ''
    };
    
    editando = false;
    idCategoriaEditando: number | null = null;
    msg = '';
    carregando = true;
    tabelaCategorias: any[] = [];

    ngOnInit() {
        this.carregarCategorias();
    }

    carregarCategorias() {
        this.api.listarCategorias().subscribe((dados: any) => {
            this.tabelaCategorias = dados.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
            this.carregando = false;
            this.cdr.detectChanges();
        });
    }

    salvarCategoria() {
        if (this.editando && this.form) {
            this.api.editarCategoria(this.idCategoriaEditando!, this.form).subscribe(() => {
                this.carregarCategorias();
                this.limparFormulario();
            });
        } else {
            this.criar();
            this.limparFormulario();
        }
    }

    criar() {
        this.api.criarCategoria(this.form).subscribe(() => {
            this.carregarCategorias();
        });
    }

    editarCategoria(id: number, categoria: any) {
        this.editando = true;
        this.idCategoriaEditando = id;
        this.form = { ...categoria };
        this.cdr.detectChanges();
    }

    excluirCategoria(id: number) {
        if (confirm('Tem certeza que deseja excluir esta categoria chamada: ' + this.tabelaCategorias.find(c => c.id === id)?.nome + '?')) {
            this.api.excluirCategoria(id).subscribe(() => {
                this.carregarCategorias();
                this.cdr.detectChanges();
            });
        }
    }

    limparFormulario() {
        this.editando = false;
        this.form = {
            nome: ''
        };
        this.cdr.detectChanges();
    }
}
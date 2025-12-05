import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { UsuariosService } from "./usuarios.service";
import { Router, RouterModule } from "@angular/router";
@Component({
  selector: 'pagina-usuarios-super-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios.html'
})
export class PaginaUsuariosSuperAdmin {
  private cdr = inject(ChangeDetectorRef)
  private service = inject(UsuariosService);
  private router = inject(Router);

  usuarios = [] as any[];

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.service.carregarUsuarios().subscribe((dados) => {
      // Filtrar apenas usuários com perfil 'ADMINISTRADOR'
      dados = dados.filter((usuario: any) => usuario.perfil === 'ADMINISTRADOR');
      // Mapear para alterar o perfil exibido
      dados = dados.map((usuario: any) => {
        return {
          ...usuario,
          perfil: 'VENDEDOR(A)/EMPREENDEDOR(A)'
        }
      });
      this.usuarios = dados;
      this.cdr.detectChanges();
    });
  }

  editarUsuario(id: number) {
    // Lógica para editar o usuário com o ID fornecido
    this.service.editarUsuario(id, {}).subscribe(() => {
      this.carregarUsuarios();
    });
    console.log(`Editar usuário com ID: ${id}`);
  }
  
  visualizarProdutoDoUsuario(id: number) {
    // Lógica para visualizar produtos do usuário com o ID fornecido
    this.router.navigate(['/super_admin/usuarios/visualizar', id]);
  }

  excluirUsuario(id: number) {
    // Lógica para excluir o usuário com o ID fornecido
    this.service.excluirUsuario(id).subscribe(() => {
      this.carregarUsuarios();
    });
    console.log(`Excluir usuário com ID: ${id}`);
  }

}
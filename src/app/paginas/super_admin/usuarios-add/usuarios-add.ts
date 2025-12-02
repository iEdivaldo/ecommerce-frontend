import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { UsuariosService } from "../usuarios.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'pagina-usuarios-add-super-admin',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios-add.html'
})
export class PaginaUsuariosAddSuperAdmin {
    private service = inject(UsuariosService);
    private router = inject(Router);
    form = {
        nome: '',
        email: '',
        senha: '',
        perfil: 'ADMINISTRADOR'
    };

    adicionarUsuario() {
        console.log(this.form)
        this.service.adicionarUsuario(this.form).subscribe({
            next: () => {
                alert('Usuário adicionado com sucesso!');
                console.log('Usuário adicionado:', this.form);
                this.router.navigateByUrl('/super_admin/usuarios');
            },
            error: (error) => {
                console.error('Erro ao adicionar usuário:', error);
                alert('Erro ao adicionar usuário. Por favor, tente novamente.');
            }
        });
    }
};
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { UsuariosService } from "./usuarios.service";

@Component({
  selector: 'pagina-usuarios-super-admin',
  imports: [CommonModule],
  templateUrl: './usuarios.html'
})
export class PaginaUsuariosSuperAdmin {

  private service = inject(UsuariosService);

  usuarios = [] as any[];

  ngOnInit() {
    // Aqui você pode carregar os usuários de um serviço ou API
    console.log(this.usuarios);
  }

  carregarUsuarios() {
    this.service.carregarUsuarios().subscribe((dados) => {
      this.usuarios = dados;
    });
  }

}
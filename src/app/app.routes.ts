import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { AdminGuard } from './core/admin.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'produtos' },

    // publico
    { path: 'produtos', loadComponent: () => import('./paginas/catalogo/lista/lista-produtos').then(m => m.ListaProdutos) },
    { path: 'produtos/:id', loadComponent: () => import('./paginas/catalogo/detalhes/detalhes-produto').then(m => m.DetalhesProduto) },
    { path: 'login', loadComponent: () => import('./paginas/usuario/login/login').then(m => m.Login) },
    { path: 'cadastro', loadComponent: () => import('./paginas/usuario/cadastro/cadastro').then(m => m.Cadastro) },
    { path: 'logout', redirectTo: 'produtos' },

    // autenticacao
    { path: 'carrinho', canActivate: [authGuard], loadComponent: () => import('./paginas/carrinho/carrinho').then(m => m.Carrinho) },
    { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./paginas/checkout/checkout').then(m => m.Checkout) },
    { path: 'administracao/produtos', canActivate: [AdminGuard], loadComponent: () => import('./paginas/administracao/admin-produtos').then(m => m.AdminProdutos) },
    { path: 'configuracoes', canActivate: [authGuard], loadComponent: () => import('./paginas/configuracoes/configuracoes-usuario').then(m => m.ConfiguracoesUsuario) },


    // super admin
    { path: 'super_admin/categorias', canActivate: [authGuard], loadComponent: () => import('./paginas/administracao/admin-categorias/admin-categorias').then(m => m.AdminCategorias) },
    { path: 'super_admin/usuarios', canActivate: [authGuard], loadComponent: () => import('./paginas/super_admin/usuarios').then(m => m.PaginaUsuariosSuperAdmin) },
    { path: 'super_admin/usuarios/add', canActivate: [authGuard], loadComponent: () => import('./paginas/super_admin/usuarios-add/usuarios-add').then(m => m.PaginaUsuariosAddSuperAdmin) },

    { path: '**', redirectTo: 'produtos' }

]
import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'catalogo' },

    // publico
    { path: 'catalogo', loadComponent: () => import('./paginas/catalogo/lista/lista-produtos').then(m => m.ListaProdutos) },
    { path: 'produto/:id', loadComponent: () => import('./paginas/catalogo/detalhes/detalhes-produto').then(m => m.DetalhesProduto) },
    { path: 'login', loadComponent: () => import('./paginas/usuario/login/login').then(m => m.Login) },
    { path: 'cadastro', loadComponent: () => import('./paginas/usuario/cadastro/cadastro').then(m => m.Cadastro) },

    // confirmando a rota pra validar renderização
    { path: 'ping', loadComponent: () => import('./paginas/ping/ping').then(m => m.PingComponent) },

    // autenticacao
    { path: 'carrinho', canActivate: [authGuard], loadComponent: () => import('./paginas/carrinho/carrinho').then(m => m.Carrinho) },
    { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./paginas/checkout/checkout').then(m => m.Checkout) },
    { path: 'admin/produtos', canActivate: [authGuard], loadComponent: () => import('./paginas/administracao/admin-produtos').then(m => m.AdminProdutos) },

    { path: '**', redirectTo: 'catalogo' }

]
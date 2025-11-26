import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfiguracoesRequest } from "./configuracoes-request";
import { ConfiguracoesUsuarioService } from "./configuracoes-usuario.service";
import { AuthService } from "../../core/auth.service";


@Component({
selector: 'app-configuracoes-usuario',
imports: [CommonModule, FormsModule],
templateUrl: './configuracoes-usuario.html'
})
export class ConfiguracoesUsuario {
    private service = inject(ConfiguracoesUsuarioService);
    private autenticacao = inject(AuthService);

    nome = '';
    email = '';
    senhaAtual = '';
    senha = '';
    confirmarSenha = '';
    erro = '';
    sucesso = '';
    ngOnInit() {
        
    }
    
    salvarConfiguracoes() {
        this.erro = '';
        this.sucesso = '';


        if (this.senha || this.confirmarSenha) {
            if (!this.validarSenha(this.senha, this.confirmarSenha)) {
                return;
            }
            if (!this.senhaAtual) {
                this.erro = 'Senha atual é obrigatória para alterar a senha.';
                return;
            }
        }
        if (this.email && !this.validarEmail(this.email)) {
            this.erro = 'Email inválido.';
            return;
        }

        const dadosAtualizacao: ConfiguracoesRequest = {
            nome: this.nome || undefined,
            email: this.email || undefined,
            senhaAtual: this.senhaAtual || undefined,
            novaSenha: this.senha || undefined
        };

        this.service.salvar(dadosAtualizacao).subscribe({
            next: (response: any) => {
                this.sucesso = response.mensagem || 'Configurações salvas com sucesso!';
                this.senhaAtual = '';
                this.senha = '';
                this.confirmarSenha = '';

            const usuarioAtual = this.autenticacao.usuario();
            if (usuarioAtual) {
                this.autenticacao.usuario.set({
                    ...usuarioAtual,
                    nome: response.nome,
                    email: response.email
                });
            }
            },
            error: (error: any) => {
                this.erro = error.error?.erro || 'Erro ao salvar configurações.';
            }
        });
    }

    validarSenha(senha: string, confirmarSenha: string) {
        if (senha !== confirmarSenha) {
            this.erro = 'As senhas não coincidem.';
            return false;
        }
        this.erro = '';
        return true;
    }

    validarEmail(email: string) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}
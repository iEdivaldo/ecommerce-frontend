import { effect, Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TemaService {
    private readonly TEMA_DARK = 'dark-theme';

    modoEscuro = signal<boolean>(this.carregarTema());

    constructor() {
        effect(() => {
            const escuro = this.modoEscuro();
            localStorage.setItem(this.TEMA_DARK, JSON.stringify(escuro));
            this.aplicarTema(escuro);
        });
    }

    private carregarTema(): boolean {
        const salvo = localStorage.getItem(this.TEMA_DARK);
        const escuro = salvo ? JSON.parse(salvo) : false;
        this.aplicarTema(escuro);
        return escuro;
    }

    private aplicarTema(escuro: boolean) {
        if (escuro) {
            document.body.setAttribute('data-bs-theme', 'dark');
        } else {
            document.body.removeAttribute('data-bs-theme');
        }
    }

    alternarTema() {
        this.modoEscuro.set(!this.modoEscuro());
    }
}
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnderecoService } from '../../core/endereco.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class Checkout {
  private enderecoService = inject(EnderecoService);
  enderecos: any[] = [];
  carregarEnderecos() {
    this.enderecoService.listar().subscribe((dados: any) => this.enderecos = dados);
  }
}

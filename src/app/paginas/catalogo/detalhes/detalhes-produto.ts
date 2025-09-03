import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-detalhes-produto',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhes-produto.html'
})
export class DetalhesProduto {
  private rota = inject(ActivatedRoute);
  private api = inject(ApiService);
  produto: any;

  ngOnInit() {
    const id = this.rota.snapshot.paramMap.get('id');
    if (id !== null) {
      this.api.obterProduto(id).subscribe(dados => this.produto = dados);
    }
  }
}

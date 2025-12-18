import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DetalhesProduto } from './detalhes-produto';

describe('DetalhesProduto', () => {
  let component: DetalhesProduto;
  let fixture: ComponentFixture<DetalhesProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesProduto, HttpClientTestingModule, RouterTestingModule],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

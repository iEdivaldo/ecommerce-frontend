import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cadastro } from './cadastro';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Cadastro', () => {
  let component: Cadastro;
  let fixture: ComponentFixture<Cadastro>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    spyOn(console, 'log');
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['registrar', 'salvarToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [Cadastro, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar email corretamente', () => {
    expect(component.validarEmail('teste@email.com')).toBeTruthy();
    expect(component.validarEmail('usuario@dominio.com.br')).toBeTruthy();
    expect(component.validarEmail('emailinvalido')).toBeFalsy();
    expect(component.validarEmail('email@')).toBeFalsy();
    expect(component.validarEmail('@dominio.com')).toBeFalsy();
  });

  it('deve validar senhas coincidentes', () => {
    expect(component.validarSenha('senha123', 'senha123')).toBeTruthy();
    expect(component.erro).toBe('');
  });

  it('deve detectar senhas diferentes', () => {
    expect(component.validarSenha('senha123', 'senha456')).toBeFalsy();
    expect(component.erro).toBe('As senhas não coincidem.');
  });

  it('deve mostrar erro quando email é inválido', () => {
    component.email = 'emailinvalido';
    component.senha = 'senha123';
    component.confirmacaoSenha = 'senha123';
    
    component.registrar();
    
    expect(component.erro).toBe('Por favor, insira um email válido.');
    expect(component.emailInvalido).toBeTruthy();
    expect(component.carregando).toBeFalsy();
    expect(authService.registrar).not.toHaveBeenCalled();
  });

  it('deve registrar usuário com sucesso', (done) => {
    const mockResponse = {
      tokens: { tokenAcesso: 'token123' },
      usuario: { id: 1, nome: 'Teste', email: 'teste@email.com' }
    };
    authService.registrar.and.returnValue(of(mockResponse));

    component.nome = 'Teste';
    component.email = 'teste@email.com';
    component.senha = 'senha123';
    component.confirmacaoSenha = 'senha123';

    component.registrar();

    setTimeout(() => {
      expect(authService.registrar).toHaveBeenCalledWith({
        nome: 'Teste',
        email: 'teste@email.com',
        senha: 'senha123',
        perfil: 'CLIENTE'
      });
      expect(authService.salvarToken).toHaveBeenCalledWith('token123', mockResponse.usuario);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/catalogo');
      expect(component.carregando).toBeFalsy();
      done();
    }, 0);
  });

  it('deve mostrar erro quando já foi cadastrado', (done) => {
    const mockError = { error: { message: 'Email já cadastrado' } };
    authService.registrar.and.returnValue(throwError(() => mockError));

    component.nome = 'Teste';
    component.email = 'teste@email.com';
    component.senha = 'senha123';
    component.confirmacaoSenha = 'senha123';

    component.registrar();

    setTimeout(() => {
      expect(component.erro).toBe('Email já cadastrado');
      expect(component.carregando).toBeFalsy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      done();
    }, 0);
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    spyOn(console, 'log');
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['entrar', 'salvarToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [Login, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
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

  it('deve inicializar com valores padrão no form', () => {
    expect(component.form.email).toBe('admin@exemplo.com');
    expect(component.form.senha).toBe('admin');
  });

  it('deve mostrar erro quando email é inválido', () => {
    component.email = 'emailinvalido';
    component.senha = 'senha123';
    
    component.entrar();
    
    expect(component.erro).toBe('Por favor, insira um email válido.');
    expect(component.emailInvalido).toBeTruthy();
    expect(component.carregando).toBeFalsy();
    expect(authService.entrar).not.toHaveBeenCalled();
  });

  it('deve fazer login com sucesso', (done) => {
    const mockResponse = {
      tokens: { tokenAcesso: 'token123' },
      usuario: { id: 1, nome: 'Admin', email: 'admin@exemplo.com' }
    };
    authService.entrar.and.returnValue(of(mockResponse));

    component.email = 'admin@exemplo.com';
    component.senha = 'admin';

    component.entrar();

    setTimeout(() => {
      expect(authService.entrar).toHaveBeenCalledWith({
        email: 'admin@exemplo.com',
        senha: 'admin'
      });
      expect(authService.salvarToken).toHaveBeenCalledWith('token123', mockResponse.usuario);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/produtos');
      expect(component.carregando).toBeFalsy();
      done();
    }, 0);
  });

  it('deve mostrar erro quando login falha', (done) => {
    const mockError = { error: { message: 'Credenciais inválidas' } };
    authService.entrar.and.returnValue(throwError(() => mockError));

    component.email = 'admin@exemplo.com';
    component.senha = 'senhaerrada';

    component.entrar();

    setTimeout(() => {
      expect(component.erro).toBe('Credenciais inválidas');
      expect(component.carregando).toBeFalsy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve mostrar erro genérico quando erro não tem mensagem', (done) => {
    authService.entrar.and.returnValue(throwError(() => ({})));

    component.email = 'admin@exemplo.com';
    component.senha = 'admin';

    component.entrar();

    setTimeout(() => {
      expect(component.erro).toBe('Ocorreu uma falha ao entrar.');
      expect(component.carregando).toBeFalsy();
      done();
    }, 0);
  });

  it('deve limpar mensagem de erro ao tentar novo login', () => {
    component.erro = 'Erro anterior';
    component.emailInvalido = true;

    authService.entrar.and.returnValue(of({
      tokens: { tokenAcesso: 'token' },
      usuario: {}
    }));

    component.email = 'teste@email.com';
    component.senha = 'senha123';
    component.entrar();

    expect(component.erro).toBe('');
    expect(component.emailInvalido).toBeFalsy();
  });

  it('deve definir carregando como true durante o login', () => {
    authService.entrar.and.returnValue(of({
      tokens: { tokenAcesso: 'token' },
      usuario: {}
    }));

    component.email = 'teste@email.com';
    component.senha = 'senha123';

    expect(component.carregando).toBeFalsy();
    component.entrar();
  });
});
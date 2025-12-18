import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService - Testes de Integração', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Limpar localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Login - Autenticação', () => {
    it('deve fazer login com credenciais válidas', () => {
      const credenciais = {
        email: 'admin@exemplo.com',
        senha: 'admin'
      };

      const mockResposta = {
        tokens: { tokenAcesso: 'token123abc' },
        usuario: { 
          id: 1, 
          nome: 'Admin', 
          email: 'admin@exemplo.com',
          perfil: 'ADMINISTRADOR'
        }
      };

      service.entrar(credenciais).subscribe(resposta => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.tokens.tokenAcesso).toBe('token123abc');
        expect(resposta.usuario.email).toBe('admin@exemplo.com');
      });

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credenciais);
      req.flush(mockResposta);
    });

    it('deve fazer login de cliente comum', () => {
      const credenciais = {
        email: 'cliente@email.com',
        senha: 'senha123'
      };

      const mockResposta = {
        tokens: { tokenAcesso: 'token456def' },
        usuario: { 
          id: 2, 
          nome: 'Cliente', 
          email: 'cliente@email.com',
          perfil: 'CLIENTE'
        }
      };

      service.entrar(credenciais).subscribe(resposta => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.usuario.perfil).toBe('CLIENTE');
      });

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResposta);
    });

    it('deve retornar erro 401 com credenciais inválidas', () => {
      const credenciais = {
        email: 'admin@exemplo.com',
        senha: 'senhaErrada'
      };

      service.entrar(credenciais).subscribe(
        () => fail('Deveria ter falhado com erro 401'),
        erro => {
          expect(erro.status).toBe(401);
          expect(erro.error.message).toBe('Credenciais inválidas');
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/login`);
      req.flush(
        { message: 'Credenciais inválidas' },
        { status: 401, statusText: 'Unauthorized' }
      );
    });

    it('deve validar formato de email no login', () => {
      const credenciais = {
        email: 'emailinvalido',
        senha: 'senha123'
      };

      service.entrar(credenciais).subscribe(
        () => fail('Deveria ter falhado'),
        erro => {
          expect(erro.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/login`);
      req.flush(
        { message: 'Email inválido' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('Cadastro - Registro de Usuário', () => {
    it('deve registrar novo cliente com sucesso', () => {
      const dadosCadastro = {
        nome: 'Novo Cliente',
        email: 'novo@email.com',
        senha: 'senha123',
        perfil: 'CLIENTE' as 'CLIENTE'
      };

      const mockResposta = {
        tokens: { tokenAcesso: 'token789ghi' },
        usuario: { 
          id: 3, 
          nome: 'Novo Cliente', 
          email: 'novo@email.com',
          perfil: 'CLIENTE'
        }
      };

      service.registrar(dadosCadastro).subscribe(resposta => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.usuario.nome).toBe('Novo Cliente');
        expect(resposta.usuario.perfil).toBe('CLIENTE');
      });

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/registrar`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dadosCadastro);
      req.flush(mockResposta);
    });

    it('deve registrar administrador', () => {
      const dadosCadastro = {
        nome: 'Novo Admin',
        email: 'admin2@email.com',
        senha: 'senha123',
        perfil: 'ADMINISTRADOR' as 'ADMINISTRADOR'
      };

      const mockResposta = {
        tokens: { tokenAcesso: 'tokenABC' },
        usuario: { 
          id: 4, 
          nome: 'Novo Admin', 
          email: 'admin2@email.com',
          perfil: 'ADMINISTRADOR'
        }
      };

      service.registrar(dadosCadastro).subscribe(resposta => {
        expect(resposta.usuario.perfil).toBe('ADMINISTRADOR');
      });

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/registrar`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResposta);
    });

    it('deve retornar erro ao cadastrar email duplicado', () => {
      const dadosCadastro = {
        nome: 'Cliente',
        email: 'cliente@email.com',
        senha: 'senha123',
        perfil: 'CLIENTE' as 'CLIENTE'
      };

      service.registrar(dadosCadastro).subscribe(
        () => fail('Deveria ter falhado'),
        erro => {
          expect(erro.status).toBe(400);
          expect(erro.error.message).toBe('Email já cadastrado');
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/registrar`);
      req.flush(
        { message: 'Email já cadastrado' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('deve validar campos obrigatórios no cadastro', () => {
      const dadosIncompletos = {
        nome: '',
        email: 'teste@email.com',
        senha: 'senha123'
      };

      service.registrar(dadosIncompletos as any).subscribe(
        () => fail('Deveria ter falhado'),
        erro => {
          expect(erro.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/registrar`);
      req.flush(
        { message: 'Nome é obrigatório' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('deve validar formato de email no cadastro', () => {
      const dadosCadastro = {
        nome: 'Cliente',
        email: 'emailinvalido',
        senha: 'senha123',
        perfil: 'CLIENTE' as 'CLIENTE'
      };

      service.registrar(dadosCadastro).subscribe(
        () => fail('Deveria ter falhado'),
        erro => {
          expect(erro.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/autenticacao/registrar`);
      req.flush(
        { message: 'Email inválido' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('Gerenciamento de Token e Usuário', () => {
    it('deve salvar token e usuário no localStorage', () => {
      const token = 'token123abc';
      const usuario = { 
        id: 1, 
        nome: 'Admin', 
        email: 'admin@exemplo.com',
        perfil: 'ADMINISTRADOR'
      };

      service.salvarToken(token, usuario);

      expect(service.token()).toBe(token);
      expect(service.usuario()).toEqual(usuario);
      expect(localStorage.getItem('token')).toBe(token);
      expect(localStorage.getItem('usuario')).toBe(JSON.stringify(usuario));
    });

    it('deve salvar apenas token sem usuário', () => {
      const token = 'token456def';

      service.salvarToken(token);

      expect(service.token()).toBe(token);
      expect(localStorage.getItem('token')).toBe(token);
    });

    it('deve verificar se usuário está autenticado', () => {
      expect(service.autenticado()).toBeFalsy();

      service.salvarToken('token123');

      expect(service.autenticado()).toBeTruthy();
    });

    it('deve verificar permissões de administrador', () => {
      const admin = { 
        id: 1, 
        nome: 'Admin', 
        perfil: 'ADMINISTRADOR' 
      };

      service.salvarToken('token', admin);

      expect(service.usuarioTemPermissao()).toBeTruthy();
    });

    it('deve verificar permissões de super admin', () => {
      const superAdmin = { 
        id: 1, 
        nome: 'Super Admin', 
        perfil: 'SUPER_ADMIN' 
      };

      service.salvarToken('token', superAdmin);

      expect(service.usuarioTemPermissao()).toBeTruthy();
    });

    it('não deve dar permissão para cliente comum', () => {
      const cliente = { 
        id: 2, 
        nome: 'Cliente', 
        perfil: 'CLIENTE' 
      };

      service.salvarToken('token', cliente);

      expect(service.usuarioTemPermissao()).toBeFalsy();
    });

    it('deve restaurar token do localStorage no constructor', () => {
      localStorage.setItem('token', 'tokenSalvo');
      localStorage.setItem('usuario', JSON.stringify({ id: 1, nome: 'User' }));

      // Reset e reconfigurar TestBed com dados já no localStorage
      TestBed.resetTestingModule();
      const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AuthService,
          { provide: Router, useValue: routerSpy }
        ]
      });

      const newService = TestBed.inject(AuthService);

      expect(newService.token()).toBe('tokenSalvo');
      expect(newService.usuario()).toEqual({ id: 1, nome: 'User' });
    });

    it('deve limpar dados inválidos do localStorage', () => {
      localStorage.setItem('token', 'token123');
      localStorage.setItem('usuario', 'json-invalido');

      // Reset e reconfigurar TestBed com dados inválidos no localStorage
      TestBed.resetTestingModule();
      const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AuthService,
          { provide: Router, useValue: routerSpy }
        ]
      });

      const newService = TestBed.inject(AuthService);

      expect(newService.token()).toBeNull();
      expect(newService.usuario()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Logout', () => {
    it('deve fazer logout e limpar dados', () => {
      service.salvarToken('token123', { id: 1, nome: 'User' });

      service.logout();

      expect(service.token()).toBeNull();
      expect(service.usuario()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/produtos']);
    });

    it('deve limpar tudo ao chamar sair', () => {
      service.salvarToken('token456', { id: 2, nome: 'Cliente' });

      service.sair();

      expect(service.token()).toBeNull();
      expect(service.usuario()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/produtos']);
    });

    it('deve limpar tudo manualmente', () => {
      service.salvarToken('token789', { id: 3, nome: 'Admin' });

      service.limparTudo();

      expect(service.token()).toBeNull();
      expect(service.usuario()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
    });
  });
});

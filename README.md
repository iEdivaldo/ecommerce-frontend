# eCommerce front-end

A aplicação está em dois links de github separados (front-end e back-end):

front-end: https://github.com/iEdivaldo/ecommerce-frontend.

back-end: https://github.com/iEdivaldo/ecommerce-backend.
1.	Para executar a aplicação, deve ter:

Git

Docker

Docker Compose 

2.	Clone os repositórios utilizando comando:

git clone https://github.com/iEdivaldo/ecommerce-frontend.git

git clone https://github.com/iEdivaldo/ecommerce-backend.git

3.	Navega até a pasta do back-end utilizando comando:

cd "caminho-da-pasta-do-back-end"

  3.1.	OBS: Certifique que tenha virtualização ativado em seu PC para mais detalhes acesse o link:

https://docs.docker.com/desktop/setup/install/windows-install/

4.	Executa o comando do Docker já instalado no PC:

docker composse up –build

5.	Provavelmente não terá nenhuns dados, então abre o Docker Desktop e executa o flyway-1 assim, adicionando novos usuários e informações necessários em seu banco de dados PostgreSQL.


DADOS DE LOGIN PARA ADMINISTRADOR (VENDEDOR/EMPREENDEDOR) E SUPER_ADMIN PARA ADMINISTRAR OS USUARIOS:

Login ADMINISTRADOR: admin@exemplo.com senha: admin

Login SUPER_ADMIN: superadmin@exemplo.com senha: admin
OBS: Apenas SUPER_ADMIN pode cadastrar usuários ADMINISTRADOR. 

ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

1. Quais tabelas você definiu inicialmente?
R: usuario; bebida; consumo; meta; configuracao; conquista; usuario_conquista.

2. Você utilizou migrations? Se sim, quantas
migrations? Descreva em uma frase o que cada
uma faz.
R:Sim. Eu precisei de 7 migrations.
001_create_usuario.sql, cria a tabela de usuários, armazenando seus dados, pontos e data de criação.
002_create_bebida.sql, cria a tabela de bebidas e seus fatores de hidratação.
003_create_consumo.sql, cria a tabela que registra os consumos de bebidas realizados pelos usuários.
004_create_meta.sql, cria a tabela responsável pelas metas de hidratação dos usuários.
005_create_configuracao.sql, cria a tabela para armazenar as configurações de lembretes dos usuários.
006_create_conquista.sql, cria a tabela que armazena as conquistas disponíveis no sistema.
007_create_usuario_conquista.sql, cria a tabela de relacionamento entre usuários e conquistas obtidas.

3. Qual o caminho do arquivo que gera a seed 
do seu banco?
R: backend/src/database/seed.ts

4. Quais os endpoints que você irá implementar
inicialmente? Cada endpoint deve ser um método
e um path. Explique em um parágrafo por que
você resolveu priorizar a implementação desses
endpoints.
R: 
POST /usuarios
POST /login
POST /consumos
POST /meta
GET /bebidas
GET /consumos
GET /meta
GET /conquistas
GET /progresso
Esses endpoints foram priorizados porque representam as funcionalidades principais do sistema. Primeiro, é necessário permitir o
cadastro e a autenticação do usuário. Em seguida, é necessário disponibilizar as bebidas cadastradas, permitir o registro dos consumos e
o gerenciamento da meta de hidratação, além de possibilitar a consulta dos consumos e da meta. Com essas funcionalidades, já será
possível implementar o fluxo principal da aplicação. Posteriormente, serão adicionadas funcionalidades complementares, como gráficos,
conquistas, pontuação, configurações e lembretes.

5. Você está usando algum framework para
escrever os endpoints da sua API? Se sim, qual?
R:Sim. O framework utilizado é o Express.js, executado com TypeScript.
[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# newFlowTS

## Informações Tecnicas

-   [Moleculer](https://moleculer.services/)

## Boas Práticas

Segue abaixo os padrões acordados pelo time de Integração:

-   Escrita de função e arquivos utilizando [CamelCase](https://pt.wikipedia.org/wiki/CamelCase)
-   Utilizar padrão declarativo de variável do TypeScript. exemplo? var x srá const ou let x.
-   Não alterar o padrão de identação sem aviso prévio
-

OBS. Desenvolvimento fora do padrão acima terá as PRs reprovadas automaticamente.

## Cuidados

Por se tratar de um código que terá chamados sincronas e assincronas, se faz necessários o entendimento dos processos envolvidos para realização da transação. Em casos de duvidas procurar algum membro do time de integração.

## Uso

Inicie o projeto com o comando `npm run dev`.
Após iniciar, abra a URL http://localhost:3000/ em seu navegador.
Na página de boas-vindas, você pode testar os serviços gerados via API Gateway e verificar os nós e serviços.

No terminal, tente os seguintes comandos:

-   `nodes` - Liste todos os nós conectados.
-   `actions` - Liste todas as ações de serviço registradas.

## Services

-   **api**: API Gateway services

## NPM scripts

-   `npm run dev`: Inicie o modo de desenvolvimento (carregue todos os serviços localmente com hot-reload e REPL)
-   `npm run start`: inicia o modo de produção (defina a variável env `SERVICES` para carregar determinados serviços)
-   `npm run cli`: Inicie uma CLI e conecte-se à produção. Não se esqueça de definir o namespace de produção com o argumento `--ns` no script
-   `npm run lint`: executa o ESLint
-   `npm run ci`: execute o modo de teste contínuo com observação
-   `npm test`: execute testes e gere relatório de cobertura
-   `npm run dc:up`: Inicie a pilha com o Docker Compose
-   `npm run dc:down`: pare a pilha com o Docker Compose

## Arquitetura

-   Nossa estrutura foi definida seguindo as recomendações do moleculer:
    -   service ou src - camada de programa ==> nome do programa que conterá os serviços (exemplo: crmIso, erpProtheusVivo, etc) - Dominio ==> nome do domino de execução que o serviço se enquadra(order, invoice, consume, etc)
        service ==> destinada ao gerenciamento dos serviços, todos os arquivos dentro dessa pasta deverão ser "service.ts"
        src ==> nessa pasta será possivel encontrar a pasta entity, repository e interfaces.

Qualquer duvida procurar os responsáveis

## Não Commitar

package-lock.json
package.json - Apenas se houver nova dependência
.vscode

## Acessando o OPENAPI

{url}/api/openapi

## Camadas

integration-layer - Midiaware centralizador das integrações
crm-iso - integração do sistema cremmer com protheus
wms-alcis - integração do wms da alcis com protheus
erp-protheus-viveo - gateway centralizador das integraçõs

## Padrões

-   Services:
    `module name` (pasta) - camelCase descritivo base do que é o sistema (wms, erp, crm ou camada) + nome do sistema ex: crmIso.
    `sub module` - no do serviço sempre no singular ex: order, payment e etc.
    `name arquive` - camelCase
    `classes` - No padrão Typescript
    `variables` - No padrão Typescript (const e let)
    `cronJob` - Usando a library CronJob

-   Entity:
    `views (ViewEntity)` - nome camelCase começando com vw minusculo
    `tabelas (Entity)` - nome camelCase começando com tb minusculo

FLOW CREMER

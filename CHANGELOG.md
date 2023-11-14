# Changelog

Notação das versões e implementações realizadas por Versão

O formato de notação tomou como base [Utilizando o Changelog](https://keepachangelog.com/en/1.0.0/)
e para determinar o versionamento foi usado [Versionamento Semantico](https://semver.org/lang/pt-BR/)

O Versionamento foi iniciado a partir da versão 1.0.0 publicada até o dia 31/12/2022

<<<<<<< HEAD
## [x.xx.xx] - xx/xx/xxxx

-   Camada de Integração
    -   Implementado teste unitários com cobertura minima de 30%
    -   Teste iniciados pela pasta service e suas subpastas
    -   Configuração do JEST extraída do arquivo package.json e implementada no arquivo jest.config.ts
    -   Atualização do arquivo GITIGNORE

## [1.32.0] - 21/09/2023
=======
## [1.34.0] - 21/09/2023

### Added

    - Integração Alcis - Protheus
        - Incluído nova filial Catalão M03.

## [1.33.0] - 21/09/2023
>>>>>>> origin/master

### Added

    - Integração ExpedLOG - Devolução
        - Incluído endpoints para buscar e integrar dados de devolução.

## [1.32.0] - 21/09/2023

### Added

-   Integração Total Express
    -   Envio das Notas Fiscais via API para a TOTAL express controlando o envio das mesmas via banco, garantindo o envio de todas as notas fiscais

## [1.31.0] - 13/09/2023

### Changed

-   Integração Ecommerce
    -   Alteração busca de produtos para receber a aliquota de IPI e informação se produto é importado, armazenamento da informação em banco de dados e envio ao Ecommerce
    -   Alterado inserção de pedido no protheus de origem do Ecommerce, para verificar se produto a ser inserido é importado ou não, caso importado é realizado o calculo para saber o valor da aliquito do IPI e deduzido do valor bruto para ser enviado ao PROTHEUS
    -   CRONs transformados em variaveis ENV para manter o padrão a camada.

## [1.30.3] - 06/09/2023

### Changed

-   Integração WMS Alcis

    -   Reprocessar confirmacao de pedido quando retornado status 500 do Protheus

## [1.30.2] - 05/09/2023

### Changed

-   Integração WMS Alcis

    -   Incluído Cremer no Order Confirmation

## [1.30.1] - 05/09/2023

### Changed

-   Integração WMS Alcis

    -   Alterado Cron Job Order Confirmation

## [1.30.0] - 05/09/2023

### Added

-   Integração WMS Alcis

    -   Melhorias na integração de pedidos e notas
    -   Camada recebe os pedidos e processa o envio para o ERP Protheus
    -   Controle de Status

## [1.29.7] - 01/09/2023

### Changed

-   Integração WMS Alcis V1.3
    -   Ajustes Axios retorno
    -   Melhoria das validações de retorno em que o Protheus devolve string no status.
    -   Melhoria nos methodos.

## [1.29.6] - 31/08/2023

### Changed

-   Integração WMS Alcis V1.3 - Correção axios se perdendo nos requests. - Melhoria das validações. - Criação de travas por filial

## [1.29.5] - 30/08/2023

### Changed

-   Integração WMS Alcis V1.3

    -   Acrescimo de index e logs especificos na confirmação de pedido.
    -   Retorno do uso do broker para balanceamento de ambas rotas.

## [1.29.4] - 29/08/2023

### Changed

-   Integração WMS Alcis V1.3

    -   Segregação execução Axios Filiais

## [1.29.3] - 29/08/2023

### Changed

-   Integração WMS Alcis V1.3

    -   Melhoria rota pararelização

## [1.29.2] - 29/08/2023

### Changed

-   Integração WMS Alcis V1.3

    -   Trava de instancias do CroJob
    -   Melhorias nos metodos de paralelização

## [1.29.1] - 25/08/2023

### Changed

-   Integração WMS Alcis V1.2
    -   Ajustes parametrização cronjob e flag

## [1.29.0] - 25/08/2023

### Changed

-   Integração WMS Alcis V1.2
    -   Melhorias na integração de reservas - I2308-10405
    -   Camada recebe os pedidos e processa o envio para o ERP Protheus
    -   Controle de Status

## [1.28.1] - 23/08/2023

### Changed

-   Novo Flow Cremer
    -   Validação de status do Pedido no protheus, capturado pelo número CRM, para verificar se o status do pedido está cancelado.

## [1.28.0] - 21/08/2023

### Changed

-   Alteração URL Integração Ouroweb
    -   Realizada a alteração da URL da Ouro, por conta da migração do ERP para nuvem.

## [1.27.0] - 21/08/2023

### Changed

-   Ajuste Cors
    -   Foi realizado o ajuste do Cors, alterando para URL de produção. Essa alteração foi feita para sanar uma vulnerabilidade apontada pelo Sonar Qualys e solicitado pelo time de segurança Viveo.

## [1.26.0] - 21/08/2023

### Changed

-   Novo Flow Cremer

    -   Ajuste no processo de geração da Ordem para o Protheus
    -   Incluíndo retry para busca de dados do processo do flow

-   Atualização de Libraries

    -   Foi realizado a atualizaçao do pacote elastic-apm-node para a versão 3.49 para resolver 2 vulnerabilidades encontrada no pacote import-in-the-middle utilizado pelo primeiro pacote citado.

-   Ecommerce
    -   Atualização do startTransaction do Ecommerce, melhorando a nomeclatura do texto

## [1.25.0] - 21/08/2023

### Added

    - Integração Alcis/Protheus
        - Alteração do REST Protheus para utilização de Broker

## [1.23.1] - 16/08/2023

### Fixed

-   Correção
    -   Correção CronJob Iso Crm

## [1.23.0] - 16/08/2023

### Changed

-   Integração Alcis
    -   Novo sistema token Camada-Alcis, bem mais performático e com taxa de erro sob "stress test" próximo de nulo.
    -   Metricas por service no APM, loggando cada service name

## [1.22.0] - 14/08/2023

### Changed

-   Novo Flow Cremer
    -   Ajustes no busca de pagamentos do ISO CRM sem pedido GERADO para gravar o dados vazio
    -   Ajustes retry do pedidos com status aguardando processamento para voltar ao status Recebido Integrador
    -   Gravação de orders_checks na geração de OF e gravação de pagamento

## [1.21.0] - 11/08/2023

### Changed

-   Novo Flow Cremer

    -   O For utilizado para extrair as informações de pagamento foram ajustadas para utilização do FOR OF ao inves do FOR LOOP
    -   Aplicado ajustes no processo de manutenção das OFs para remover a duplicidade de dados.
    -   Incluido a inserção dos dados sobre pagamento na orders_checks
    -   Incluido a inserção dos dados sobre os pedidos na orders_checks
    -   Ajuste no DEPARA do pagamento para gravar na base do integrador quando não encontrar os dados na tabela do Integrador

-   Ecommerce
    -   Ajuste no retry de reenvio de ordens para o endereço interno
    -   Atualização dos Token do processo de Ecommerce para token Global

## [1.20.0] - 27/07/2023

### Changed

-   Endereço do Elastic Search atualizado da conta Enterprise, adicionada nova instancia.
-   Adcionada resiliencia base em caso de quedas.

## [1.19.4] - 21/07/2023

### Fixed

-   Novo Flow Cremer

    -   Conversar do tipo object para string quando o object vem como string do protheus e se faz necessário converter para Objeto para extração das informação do customer e voltar para string para armazenar a informação no banco de dados.

-   Integração Ecommercer
    -   Foi ajustado para apresentação do erro ao incluir os dados do customer e tiver erro de inclusão

## [1.19.3] - 19/07/2023

### Fixed

-   Novo Flow Cremer
    -   Incluido rotina para tratar registros com status 'Aguardando Processamento', durante a validação é verificado se o registro existe no protheus em caso positivo é relaizado atualização atualização da tabelas orders para 'Gerado Ordem' e incluido o numero do registro gerado no Protheus, caso negativo o pedido do ISO volta para a fila com o status 'Validacao Produto'

## [1.19.2] - 19/07/2023

### Fixed

-   Novo Flow Cremer

    -   Incluido tratamento no JSON do CONSUMER, alguns casos possui os carectes "/t/t" vinculado a alguma parte do nome do registros, foi aplicado ajustes para tratar o problema, removendo os caracteres especiais

-   Integração Ecommerce

    -   Ajuste no envio de dados no serviço CLIMBA ao ELASTIC quando obtiver sucesso no envio de dados ao climba
    -   Erro de busca de dados do PUT ou POST do consumer na geração de ordem, foi aplicado tratamento.

-   ENV
    -   Inclusão das variaveis abaixo para sanar erro de geração de pagamento com Origem ISOCRM:
        -   CODE_COMPANY_CRM='11'
        -   CODE_SYSTEM_CRM='1'
        -   CODE_COMPANY_ERP='11'
        -   CODE_SYSTEM_ERP= 2

## [1.19.1] - 14/07/2023

### Changed

-   Novo Flow Cremer

    -   Diminuição no tempo de integração dos registros do Flow de 2 minutos para 1 minuto
    -   Atualização do error.code para default '499'

-   Integração Ecommerce
    -   Ajuste na integração do Ecommerce

### Fixed

-   Novo Flow Cremer
    -   Removido o TRIM na validação do campo "ManOF_QuebraOF45M3"

## [1.19.0] - 14/07/2023

### Added

-   Novo Flow Cremer
    -   Reestruturação da arquitetura do Flow Cremer, utilizando a estrutura do framework
        MoleculerJS, removendo o Azure Service Bus e aplicando as soluções do framework.
    -   Condição de Pagamento:
        -   Implementação de rotina que realiza a busca no Protheus e armazena na base de DEPARA
            no Integrador por meio de UpInsert.
    -   Implementação da rotina que extrai os pedidos do banco de dados do ISOCRM:
        -   Geração de OF:
            -   Busca das OFs no ISOCRM via CRON de tempos em tempos
            -   Tratamento das mensagens capturadas
            -   Gravação das OFs capturadas no banco de integrador
            -   Envio das mensagens de acordo com a Interface de dados estabelecida com o time
                Protheus
            -   O retorno do envio dos dados ao Protheus é validado e ajustado para devolutiva
                para ISOCRM, atualizando o status na tabela LOGFLOW
            -   Atualização do status dos pedidos na tabela do integrador
    -   Manutenção de OF:
        -   Solicitação de alterações no pedido feito no ISOCRM
        -   Implementação de retry para melhorar o fluxo de devolução de solicitações do ERP
            Protheus para o CRM ISO em casos de exceção
    -   Confirmação de Pagamento:
        -   Reestruturação da rotina que busca os dados de pagamento via cartão de crédito no
            ISOCRM e envia para confirmar o pagamento no Protheus
    -   Situação dos Pedidos:
        -   Reestruturação da rotina que busca a situação dos pedidos no Protheus e faz o envio do
            mesmo ao ISOCRM
    -   Implementação de melhorias e tratamentos de maneira geral, para evitar quedas da aplicação
        como um todo.
    -   Implementação de rastreabilidade de logs mais apurados e métricas:
        -   Envio, inserção e armazenamento de logs no ElasticSearch
        -   Rastreabilidade de métricas, erros e exceções com ElasticAPM
        -   Visualização didática de logs e métricas através da ferramenta Kibana (via Web)

### Changed

-   Atualização Variaveis ENV
    -   Foi realizado uma atualização do .envHomologation com as novas variaveis incluídas na master

### Removed

-   Removido arquivo .envDevelopment, o arquivo é uma cópia do .envHomologation não tendo mais necessidade da sua existência, podendo gerar duvidas nos desenvolvedores.

## [1.18.0] - 13/07/2023

### Changed

-   Integração Ecommerce Climba
    -   Incluído tratamento para remover "0" a esquerda no número da nota fiscal quando o mesmo existir.

## [1.17.0] - 12/07/2023

### Added

-   Inserção TenantID Request Alcis/Protheus.

## [1.16.1] - 12/07/2023

### Security

-   Atualização de Segurança da Camada:
    -   Bibliotecas
        -   Typeorm "0.3.16"
            -   "0.3.15" Vulnerabilidade #CVE-2023-0842
    -   Remoção
        -   K8s.yaml
            -   Vulnerabilidade
    -   Implementações correções
        -   Xss
        -   Helmet
        -   hpp
        -   compression
    -   Melhorias no Api Service
        -   Uso da função onBeforeCall para interceptar requisições para validações.
        -   Organização de rotas.
        -   Segregação do serviços.
    -   Validações
        -   Criação de Algoritmos
            -   Validação de body
            -   Validação de queryString
            -   Validação de Headers
                -   User-Agent
                -   Authorization
                -   Content-Type
                    -   application/json
                    -   application/xml

## [1.16.0] - 07/07/2023

### Fixed

-   Ajustado response e status enviado para o ElasticSearch, garantindo o envio apenas de dados string.

### Changed

-   Integração Ecommerce
    -   Nas requisições realizadas ao climba estamos incluindo o start transaction e endtransaction, para verificar a apresentação no Elastic

## [1.15.0] - 06/07/2023

### Changed

-   Ajustado indexName dos arquivos utilizados pela integração Bellacottom CLimba para o padrão flow-ecommerce-???
-   Endereço do Elastic Search atualizado da conta gratuita para a conta Enterprise

## [1.14.0] - 20/06/2023

### Changed

-   Correção de variável PROTHEUSVIVEO_BASEURL no ENV para valor correto
-   Ajustes na verificação de valor no momento de ativação de CRONJOB, ajustes necessário para cleanCode e para evitar problemas de mau funcionamento no futuro.

## [1.13.0] - 14/06/2023

### Changed

-   Atualização dos arquivos para utilizar o gerenciador de token da camada:
    -   Arquivos Viveo
        -   triangulationTypesPfs
            -   poolGetTriangulationTypeDataErp
        -   requestOrderSalePfs
            -   postRequestOrderSalePfs
    -   Arquivos Expressa
        -   requestPfs
            -   postRequestPfs
        -   stockPfs
            -   getStockPfs
            -   StocksGet

## [1.12.1] - 09/06/2023

### Changed

-   Atualização da variavel do arquivo .env "PROTHEUSVIVEO_BASEURL" para "http://tecnico.protheus.viveo.prod:9050/rest"

## [1.12.0] - 05/06/2023

### Added

-   Controle de Token Global
    -   Implementado a rotina de controle de token utilizando o banco de dados para minimizar o numero de request para geração de token no protheus.
    -   A rotina ficou transparente para uso, porem com um controller que faz a gestão do token, renovando a cada 55 minutos.
    -   O controle de token utiliza a URL como ponto de partida para todo o processo.
-   Integração Ecommerce Climba
    -   Incluido reenvio de notas fiscais com status diferente de "success"
        -   A necessidade surgiu devido ao erro do Elastic onde alguns pedidos ficaram travados na Camada, devido a queda dos serviços do servidor do Protheus e da Camada
        -   Incluindo uma subrotina para buscar os dados do municipio utilizando o CEP em uma API externa, quando ocorrer erro no retorno do protheus

### Changed

-   Integração Ecommerce Climba
    -   Ajustado a rotina de orderEcommerce.service.ts dentro do serviço do integrador para validar e contemplar a forma de pagamento PIX
    -   Implementado a rotina de geração de token global em produção para teste utilizando a bellacotton como ponto de partida
    -   Ajustado consulta de retentativa dos registros com erro.
    -   Ajustado consulta utilizada para confirmação de registros integrados com sucesso, para sinalizar o climba
-   Downgrade mssql e typeORM para resolução de BUG encontrado na ultima versão.
    -   O TypeORM não transpila os createBuilder corretamente, gerando erro nas consultas, inserts ou update que utilizada
    -   Versões com erro: TYPEORM 0.3.15 / MSSQL 9.1.1

### Removed

-   Caixas Retornaveis
    -   Remoção da integração das caixas retornaveis

## [1.11.1] - 25/05/2023

### Changed

-   Mudança do Base URL Protheus/ExpedLOG

## [1.11.0] - 12/05/2023

### Added

-   Integração Senior / Unico

    -   Criação de Vagas
        -   Endpoint POST para envio e cadastro de dados do candidato na Unico.
        -   Validação da existência de departamento através do endpoint GET departamentos. Caso não exista, realiza o
            cadastro através do endpoint POST departamentos.
        -   Validação de funções (roleId) através do endpoint GET RoleId. Caso não exista, realiza o cadastro através do
            endpoint POST RoleId.
    -   Webhook (callback)
        -   Endpoint POST recebe atualizações de candidatos da Unico através de webhook.
        -   O webhook da Unico dispara a atualização dos dados para a camada e a mesma encaminha ao endpoint POST webhook
            no Senior.

-   Integração Senior / Ouro
    -   Endpoint POST para cadastro e liberação de benefícios de funcionários.

### Changed

-   Conexão database
    -   Alteração do endereço de conexão com o banco do Crm Iso para VDCAZRISODB01.viveo.corp.

## [1.10.0] - 07/05/2023

### Added

-   Integração ExpedLOG
    -   Incluído o endpoint para envio de uma nova rota. Caminho: Protheus -> ExpedLOG.
    -   Incluído dados empresa CREMER.

## [1.9.0] - 27/04/2023

### Added

-   Rotina de Retry para multi serviços
    -   Foi implementado uma rotina de retry unificada que permite armazenamento da ultima da de execução do retry e a
        partir dela controlar todas as retry futuras, garantindo que mesmo com queda do servidor superior ao tempo de
        retry estabelecido o mesmo irá pegar a janela de tempo da parada.
    -   Criação da tabela de logsRetry no banco de dados para armazenamento em formato de pilha
    -   Criacão do metodo GET e POST para buscar o último registro de acordo com o systemName(Nome do
        Serviço/Processo/Sistema) e determinar se gera ou não não um novo registro.

### Changed

-   Integração Ecommerce Climba
    -   Método retry de busca de pedidos no climba foi alterado para utilizar o novo formato de busca utilizando a rotina
        de retry implementada nessa versão
    -   Método retry de busca de notas fiscais do protheus e enviadaa ao climba foi alterado para utilizar o novo formato
        de busca utilizando a rotina de retry implementada nessa versão

## [1.8.7] - 02/05/2023

### Changed

-   Integração Iso Crm
    -   Remoção resend orders.

## [1.8.6] - 27/04/2023

### Changed

-   Integração Alcis
    -   Ajuste rota order confirmation
    -   Type const axios interceptor

## [1.8.5] - 20/04/2023

### Changed

-   Integração Cremer / Protheus
    -   Ajuste no TenantId enviado ao Protheus
    -   Ajuste no putStatus adicionado gravação de BranchId
    -   Atualização do CRON JOB para 20 minutos.

## [1.8.4] - 18/04/2023

### Changed

-   Integração Cremer / Protheus
    -   Tratamento dos pedidos do ISO CRM que já existem no Protheus.
    -   Atualização do CRON JOB para 10 minutos.

## [1.8.3] - 13/04/2023

### Added

-   Integração Cremer / Protheus
    -   Adicionado endpoint para realizar o reenvio dos pedidos com falsos OK (não gerou OF no Protheus) ao Protheus.
        -   Foi disponiblizado um endpoint com cron (reenvio automático) para realizar o reenvio dos pedidos com falso OK
            de OF gerada no Protheus. ISOCRM -> Protheus

## [1.8.2] - 10/04/2023

### Added

-   Integração Alcis
    -   Adicionado endpoint Received Receipt Confirmation.
        -   Foi disponiblizado uma rota para envio de confirmação de recibo/nota fiscal. Alcis -> Protheus

## [1.8.1] - 06/04/2023

### Changed

-   Integração CrossDockng / Triangulação PFS
    -   Atualizado BASEURL do SAP.
        -   Foi disponibilizado uma rota com certificado SSL para envio das requisições

## [1.8.0] - 05/04/2023

### Added

-   Integração ExpedLOG
    -   POST Invoice Integration:
        -   Envia uma Nota Fiscal Protheus -> ExpedLOG
    -   Webhook Fetch Invoice:
        -   Atualiza os dados da Nota Fiscal da Integração após o ExpedLOG receber o retorno do Comprovei, as informações
            são enviadas ao Protheus
    -   POST SLA:
        -   Solicita Recálculo e Busca Informações da Tabela de SLA: Protheus -> ExpedLOG
    -   POST Schedule Delivery
        -   Agenda uma Previsão de Entrega: Protheus -> ExpedLOG

## [1.7.1] - 05/04/2023

### Changed

-   Integração CT-e NF-e
    -   POST Documents
        -   Parametrização dos campos de receiver para opcional no modelo I, em produção passa a ser opcional. Solicitado
            Carlos Niemeyer e Guilherme Ricci.

## [1.7.0] - 03/04/2023

### Added

-   Integração CT-e NF-e
    -   POST Documents:
        -   Hibrido - Aceita 3 (três) tipos de interfaces (JSON)
        -   Método POST Envia Dados CTE -> Consome API POST Protheus de Envio de Dados CTE
        -   Método POST Envia Dados DE5 -> Consome API POST Protheus de Envio de Dados DE5
        -   Método POST Envia XML NF-e -> Consome API POST Protheus de Envio XML NF-e
    -   GET Documents:
        -   Método GET Consulta Status CT-e Enviado -> Recebe Dados com XML em Base64 Binary + Status com Log de Sucesso
            ou Erro
    -   WEBHOOK Documents:
        -   Método POST (Call Back) Envio Status CT-e para Jarilog

## [1.6.15] - 31/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Adicionado um setTimeout de 2000 milisegundos na camada do integrador de inclusão de ordens
    -   Removido o setTimeout que foi incluindo na camada do protheus para inclusão de ordens

## [1.6.14] - 31/03/2023

### Changed

-   Elastic
    -   Atualização de busca de data por timezone America/São Paulo
-   Moleculer
    -   Ajuste na data do logger do elastic por timezone America/São Paulo

## [1.6.13] - 31/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Ajuste nos campos cCodBU e cLoteUnico na inclusão de OF. Valores fixos foram alterados a pedido do Gabriel Santos
    -   Adicionado novos campos na integração do cadastro de cliente

## [1.6.12] - 24/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Adicionado campo cDesconto a pedido do Gabriel Santos no cabeçalho do pedido, para que seja integrado o valor
        total do desconto informado.

## [1.6.11] - 21/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Alterado o tempo de parada no momento do envio do Pedido de vendo ao Protheus de 500 milisegundos para 1500
        milisegundos

## [1.6.10] - 17/03/2023

### Changed

-   Triangulação PFS Protheus
    -   Alteração URL PROTHEUS para integração dos dados com a PFS

## [1.6.9] - 16/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Alterado o intervalo de busca de dados para retentativa de integração dos dados de Nota Fiscal e Pedido. Incluindo
        intervalo.

## [1.6.8] - 15/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Alteração do tempo de busca das notas fiscais para executar a cada 3 minutos buscando dados no protheus a cada 6
        minutos
    -   Inclusão de uma rotina para retentativa a cada 60 minutos, será util para os casos de paradas da camada programa
        ou não

## [1.6.7] - 14/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Alteração no parametro para buscar notafiscal

## [1.6.6] - 13/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Ajustes na emissão de nota fiscal, inclusão do campo XML

## [1.6.5] - 10/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Incluindo tratamento para remover o escape '\\' enviado pelo climba quando para tratar string com caracteres
        especiais como o aspóstrofo
    -   Foi aumentado o tempo de busca da retentiva de integração de pedidos para 60 minutos

## [1.6.4] - 09/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Ajustes na busca de cidades
    -   Ajustes no cadastro de pedidos para tratar erros de GET

## [1.6.3] - 08/03/2023

### Changed

-   Integração Alcis
    -   Adequação de validação no serviços de confimação de orders e de reserva.
    -   Novo paramtro rest para empresa Mafra.

## [1.6.2] - 07/03/2023

### Changed

-   Integração Ecommerce Climba
    -   Foi realizar um ajuste no serviço de busca de produtos para realizar a busca apenas das empresa que forem listadas
        no endpoint getEcommercesXlabels
    -   Habilitação da atualização dos dados dos clientes quando o mesmo existir

## [1.6.1] - 06/03/2023

### Added

-   Inserção dos dados de produção da triangulação PFS - Protheus nos arquivos .env e .envProduction

## [1.6.0] - 06/03/2023

### Added

-   Integração entre Sistema Senior x Gupy
    -   Criação de Vagas
        -   Endpoint POST publicado, recebe requisição Senior para envio a Gupy.
        -   Validação de depatamentos (departaments)
        -   Validação de filiais (brachId)
        -   Validação de funções (roleId)
    -   Weebhook (callback)
        -   Endpoint POST publicado, para receber request WEBHOOK da Gupy.
    -   Cadastro de depatamentos (departaments)
        -   Endpoint POST publicado, realiza cadastro de departamentos na Gupy.
    -   Cadastro de filiais (brachId)
        -   Endpoint POST publicado, realiza cadastro de filiais na Gupy.
    -   Cadastro de funções (roleId)
        -   Endpoint POST publicado, realiza cadastro de funções na Gupy.
    -   Busca de depatamentos (departaments)
        -   Endpoint GET publicado, realiza a busca do departamento na Gupy por parametros id, name, code e em sem
            parametros busca globalmente.
    -   Busca de filiais (brachId)
        -   Endpoint GET publicado, realiza a busca das filiais na Gupy por parametros id, name, code e em sem parametros
            busca globalmente.
    -   Busca de funções (roleId)
        -   Endpoint GET publicado, realiza a busca das funções na Gupy por parametros id, name, code e em sem parametros
            busca globalmente.

## [1.5.2] - 06/03/2023

### Changed

-   Integração Alcis
    -   Criação de novo parametro no .env e alteração no endpoint de confirmação de ordens no processo Mafra.

## [1.5.1] - 03/03/2023

### Changed

-   Inclusão da transportadora FIXADO para 100095 - no processo de inclusão da ordem de origem climba/bellacotton

## [1.5.0] - 02/03/2023

## Added

-   Envio das rotas de triangulação(tipo triangulação) para a PFS
    -   Extração das rotas de triangulação do Protheus e envio para a PFS

## [1.4.2] - 02/03/2023

### Changed

-   Habilitado buscar de produtos da PURELL para integração no ECOMMERCE da CLIMBA a pedido da:
    -   Euivna - Depto de Marketing
    -   Aprovado pelo Wanderson Machado e Fernanda Pereira

## [1.4.1] - 02/03/2023

### Changed

-   Atualização no processo de validação do envio de Notas Fiscais para atualização status com descrição do erro quando
    ocorrer

## [1.4.0] - 28/02/2023

### Added

-   Integração com o Ecommerce da Climba
    -   Cadastro de Marcas - execução via CronJOB a cada 120 minutos
    -   Cadastro de Categorias - execução via CronJOB a cada 120 minutos
    -   Cadastro de Produtos - execução via CronJOB a cada 120 minutos
    -   Busca de nota fiscal emitida e faturada via protheus e envio ao Climba - execução via CronJOB a cada 5 minutos
    -   Atualização de estoque no climba de acordo com validação de quantidade enviada anteriormente - execução via
        CronJOB a cada 5 minutos
    -   Busca de pedidos no Ecommerce e geração do pedido no ERPProtheus VIVEO
        -   Endpoint POST publicado para receber via WEBHOOK do climba
        -   Busca order geradas nos ultimos 30 minutos para garantir integração em caso de queda de serviço
    -   Busca de dados de pagamento pela Forma e quantidade de vezes
    -   Busca de clientes pessoa fisica via endpoint GET com numero do CPF
    -   Cadastro de cliente pessoa fisica
    -   Criação de tabelas para armazenar os pedidos,produtos, invoice e stock integrados

### Changed

-   Melhorias na interface de ordem
-   Melhorias na interface de customer
-   Ajustes na library axios

## [1.3.0] - 27/02/2023

### Changed

-   Integração Alcis
    -   Criação de endpoint Get Reservation Confirmation
    -   Criação de endpoint Post Reservation Confirmation
    -   Criação de endpoint Post Order Confirmation
    -   Ajuste endpoint Put Order Confirmation Alcis
    -   Implementação de aliases multi empresas
    -   Melhorias geração de token
    -   Melhoria fluxo da controller

## [1.2.1] - 23/02/2023

### Changed

-   Ajuste no packagejson
    -   Atualização dos pacotes MSSQL e TYPERORM
    -   Remoção / Atualização dos pacotes depreciados
    -   Resolução das peerdependecys, removendo a necessidade da execução do comando npm install --legacy-peer-deps, agora
        apenas o npm install instala todos os pacotes

## [1.2.0] - 17/01/2023

### Added

-   Rotina de validação pré-commit
    -   Formata arquivos no pré-commit
    -   executa função do eslint para resolver problemas com espaçoes ou quebra de linhas incorretas

### Changed

-   Reorganização da estrutura de pastas
-   Habilitação do LINT para avaliação de erros e correção
-   Habilitação no Format

## [1.1.0] - 02/01/2023

### Added

-   Integração PFS x Protheus
    -   Implementação do envio de produtos do Estoque Protheus para a PFS
    -   Recebimento dos pedidos enviados pelo SAP a API FLOW e posteriomente enviado ao PROTHEUS
    -   Criação de duas tabelas gerenciadas pelo integrador para armazenar as informações dos pedidos e produtos enviados
-   Criado arquivo com as informações do ENV produtivo e de homologação, para auxiliar nos deploys
    -   .envProduction - ENV com a configuração do ambiente produtivo
    -   .envHomologation - ENV com a configuração do ambiente de homologação
-   Implementado o Uso do ChangeLOG
-   Implementado o Uso do Versionamento via SEMVER, utilizando o DEFAULT sugerido.

## [1.0.0] - 31/12/2022

Integrações entregues até o dia 31/12/2022

### Added

-   Integração Alcis x Protheus
-   Integração GKO x Protheus
-   Integração BoxiFarma x Protheus
    -   Endpoint consulta de produtos PROTHEUS VIVEO
    -   Endpoint envio de ordens de venda PROTHEUS VIVEO

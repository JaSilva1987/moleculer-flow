CREATE DATABASE integrador
GO

USE integrador
GO


CREATE TABLE buy_orders (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	idBuyOrdersArray int NOT NULL,
	tenantId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	branchId varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	buyOrderId nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	invoiceId varchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	jsonBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	jsonInvoiceBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	statusBuyOrder nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	retry int NULL,
	nextRetry datetime NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	logBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__buy_orde__3213E83FDFA2F1E6 PRIMARY KEY (id)
);
GO

CREATE TABLE buy_orders_log (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	idBuyOrdersArray int NOT NULL,
	tenantId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	branchId varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	buyOrderId nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	jsonBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	jsonInvoiceBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	statusBuyOrder nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	logBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	createdAt datetime NULL
);
GO

CREATE TABLE buy_orders_pdf (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	buyOrder int NOT NULL,
	invoice varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	inspection varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	imageName varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	imagePdf varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	status varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	CONSTRAINT PK__buy_order_pdf PRIMARY KEY (id)
);
GO

CREATE TABLE feedbacks (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	invoiceId nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[result] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	status nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL
);
GO

CREATE TABLE flow_empresas (
	cod_empresa varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	nome_empresa varchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT pk_flow_empresas PRIMARY KEY (cod_empresa)
);
GO

CREATE TABLE inspect_buy_orders (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	tenantId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	branchId varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	invoiceId varchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	jsonInvoiceBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	statusInspectBuyOrder nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	retry int NULL,
	nextRetry datetime NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL,
	logInspectBuyOrder nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__inspect___3213E83FC920930A PRIMARY KEY (id)
);
GO

CREATE TABLE integracao_clients_gtplan (
	id int IDENTITY(1,1) NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	integrationDate datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_clients_gtplan PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_endQuery ON dbo.integracao_clients_gtplan (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_integrationDate ON dbo.integracao_clients_gtplan (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_queryKey ON dbo.integracao_clients_gtplan (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_clients_gtplan_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_clients_gtplan_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_log_actionName ON dbo.integracao_clients_gtplan_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_log_insertedAt ON dbo.integracao_clients_gtplan_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_log_responseCode ON dbo.integracao_clients_gtplan_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_log_status ON dbo.integracao_clients_gtplan_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_clients_gtplan_log_topic ON dbo.integracao_clients_gtplan_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_comprovei_ocorrencias (
	id int IDENTITY(1,1) NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	totalOccurrences int NULL,
	totalPages int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	integrationDate datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_comprovei_ocorrencias PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_endQuery ON dbo.integracao_comprovei_ocorrencias (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_integrationDate ON dbo.integracao_comprovei_ocorrencias (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_queryKey ON dbo.integracao_comprovei_ocorrencias (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_comprovei_ocorrencias_config (
	id int IDENTITY(1,1) NOT NULL,
	empresa varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	filial varchar(6) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	integrado bit NOT NULL
);
GO

CREATE TABLE integracao_comprovei_ocorrencias_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_comprovei_ocorrencias_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_log_actionName ON dbo.integracao_comprovei_ocorrencias_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_log_insertedAt ON dbo.integracao_comprovei_ocorrencias_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_log_responseCode ON dbo.integracao_comprovei_ocorrencias_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_log_topic ON dbo.integracao_comprovei_ocorrencias_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_logg_status ON dbo.integracao_comprovei_ocorrencias_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_comprovei_ocorrencias_range (
	id int IDENTITY(1,1) NOT NULL,
	cod int NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrationDt datetime DEFAULT getdate() NULL,
	integrationAt datetime DEFAULT getdate() NULL,
	CONSTRAINT PK_integracao_comprovei_ocorrencias_range PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_range_cod ON dbo.integracao_comprovei_ocorrencias_range (  cod ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_comprovei_ocorrencias_range_integrationAt ON dbo.integracao_comprovei_ocorrencias_range (  integrationAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_config (
	id int IDENTITY(1,1) NOT NULL,
	company varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	subsidiary varchar(6) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	comprovei_layer bit NOT NULL,
	pelican_layer bit NOT NULL,
	CONSTRAINT PK_integracao_config PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_config_company ON dbo.integracao_config (  company ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_config_comprovei_layer ON dbo.integracao_config (  comprovei_layer ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_config_pelican_layer ON dbo.integracao_config (  pelican_layer ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_config_subsidiary ON dbo.integracao_config (  subsidiary ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_inspect_register (
	id int IDENTITY(1,1) NOT NULL,
	ordem varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	cliente varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	loja varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	filial varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	etapa varchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	json varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrationDt datetime DEFAULT getdate() NULL,
	integrationAt datetime DEFAULT getdate() NULL,
	CONSTRAINT PK_integracao_inspect_register PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_At ON dbo.integracao_inspect_register (  integrationAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_cliente ON dbo.integracao_inspect_register (  cliente ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_filial ON dbo.integracao_inspect_register (  filial ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_ordem ON dbo.integracao_inspect_register (  ordem ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_inspect_register_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_inspect_register_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_log_actionName ON dbo.integracao_inspect_register_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_log_insertedAt ON dbo.integracao_inspect_register_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_log_responseCode ON dbo.integracao_inspect_register_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_log_topic ON dbo.integracao_inspect_register_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_logg_status ON dbo.integracao_inspect_register_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_inspect_register_update (
	id int IDENTITY(1,1) NOT NULL,
	ordem varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	cliente varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	loja varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	filial varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	etapa varchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ordem_inspecao varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrationDt datetime DEFAULT getdate() NULL,
	integrationAt datetime DEFAULT getdate() NULL,
	CONSTRAINT PK_integracao_inspect_register_update PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_update_At ON dbo.integracao_inspect_register_update (  integrationAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_update_cliente ON dbo.integracao_inspect_register_update (  cliente ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_update_filial ON dbo.integracao_inspect_register_update (  filial ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_inspect_register_update_ordem ON dbo.integracao_inspect_register_update (  ordem ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_config (
	id int IDENTITY(1,1) NOT NULL,
	conector varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	idCliente varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	clienteErp varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	lojaErp varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	empresaErp varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	tipoErp varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	nomeCliente varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ativo char(1) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'S' NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	filialErp varchar(6) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__integrac__3213E83FFD552640 PRIMARY KEY (id)
);
GO

CREATE TABLE integracao_ordens_compra_dados_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_ordens_compra_dados_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_actionName#integracao_ordens_compra_dados_log ON dbo.integracao_ordens_compra_dados_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_insertedAt#integracao_ordens_compra_dados_log ON dbo.integracao_ordens_compra_dados_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_responseCode#integracao_ordens_compra_dados_log ON dbo.integracao_ordens_compra_dados_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_status#integracao_ordens_compra_dados_log ON dbo.integracao_ordens_compra_dados_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_topic#integracao_ordens_compra_dados_log ON dbo.integracao_ordens_compra_dados_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_dados_reg_insp_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_ordens_compra_dados_reg_insp_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_actionName#integracao_ordens_compra_dados_reg_insp_log ON dbo.integracao_ordens_compra_dados_reg_insp_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_insertedAt#integracao_ordens_compra_dados_reg_insp_log ON dbo.integracao_ordens_compra_dados_reg_insp_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_responseCode#integracao_ordens_compra_dados_reg_insp_log ON dbo.integracao_ordens_compra_dados_reg_insp_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_status#integracao_ordens_compra_dados_reg_insp_log ON dbo.integracao_ordens_compra_dados_reg_insp_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_topic#integracao_ordens_compra_dados_reg_insp_log ON dbo.integracao_ordens_compra_dados_reg_insp_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_etiqueta_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_ordens_compra_etiqueta_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_actionName#integracao_ordens_compra_etiqueta_log ON dbo.integracao_ordens_compra_etiqueta_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_insertedAt#integracao_ordens_compra_etiqueta_log ON dbo.integracao_ordens_compra_etiqueta_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_responseCode#integracao_ordens_compra_etiqueta_log ON dbo.integracao_ordens_compra_etiqueta_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_status#integracao_ordens_compra_etiqueta_log ON dbo.integracao_ordens_compra_etiqueta_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_topic#integracao_ordens_compra_etiqueta_log ON dbo.integracao_ordens_compra_etiqueta_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_inspecao_checks (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	buyOrderId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	checkDescription varchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	seq int NULL,
	finalSeq int NULL,
	topicName varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	deletedDate datetime NULL,
	sent bit DEFAULT 0 NULL,
	success bit NULL,
	retryNumber int DEFAULT 0 NULL,
	nextTry datetime NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	url varchar(2000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[method] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	body varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode int NULL,
	response varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	validations_ok bit DEFAULT 0 NULL,
	CONSTRAINT pk_integracao_ordens_compra_inspecao_checks PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_buyOrderId#integracao_ordens_compra_inspecao_checks ON dbo.integracao_ordens_compra_inspecao_checks (  buyOrderId ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_checkDescription#integracao_ordens_compra_inspecao_checks ON dbo.integracao_ordens_compra_inspecao_checks (  checkDescription ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_idConfig#integracao_ordens_compra_inspecao_checks ON dbo.integracao_ordens_compra_inspecao_checks (  idConfig ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_queryKey#integracao_ordens_compra_inspecao_checks ON dbo.integracao_ordens_compra_inspecao_checks (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_materiais_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_ordens_compra_materiais_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_actionName#integracao_ordens_compra_materiais_log ON dbo.integracao_ordens_compra_materiais_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_insertedAt#integracao_ordens_compra_materiais_log ON dbo.integracao_ordens_compra_materiais_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_responseCode#integracao_ordens_compra_materiais_log ON dbo.integracao_ordens_compra_materiais_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_status#integracao_ordens_compra_materiais_log ON dbo.integracao_ordens_compra_materiais_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_topic#integracao_ordens_compra_materiais_log ON dbo.integracao_ordens_compra_materiais_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_solicitacao_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_ordens_compra_solicitacao_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_actionName#integracao_ordens_compra_solicitacao_log ON dbo.integracao_ordens_compra_solicitacao_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_insertedAt#integracao_ordens_compra_solicitacao_log ON dbo.integracao_ordens_compra_solicitacao_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_responseCode#integracao_ordens_compra_solicitacao_log ON dbo.integracao_ordens_compra_solicitacao_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_status#integracao_ordens_compra_solicitacao_log ON dbo.integracao_ordens_compra_solicitacao_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_topic#integracao_ordens_compra_solicitacao_log ON dbo.integracao_ordens_compra_solicitacao_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_companies (
	id int IDENTITY(1,1) NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	totalPages int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	integrationDate datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_companies PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_endQuery ON dbo.integracao_pelican_companies (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_integrationDate ON dbo.integracao_pelican_companies (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_queryKey ON dbo.integracao_pelican_companies (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_companies_config (
	id int IDENTITY(1,1) NOT NULL,
	conector varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	empresaIdERP varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	filialIdERP varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	cnpj varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	tipoErp varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	nomeCliente varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ativo char(1) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'S' NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL
);
GO

CREATE TABLE integracao_pelican_companies_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_companies_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_iintegracao_pelican_companies_log_topic ON dbo.integracao_pelican_companies_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_log_actionName ON dbo.integracao_pelican_companies_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_log_insertedAt ON dbo.integracao_pelican_companies_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_log_responseCode ON dbo.integracao_pelican_companies_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_companies_log_status ON dbo.integracao_pelican_companies_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_config_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_config_log PRIMARY KEY (id)
);
GO

CREATE TABLE integracao_pelican_invoices_range (
	id int IDENTITY(1,1) NOT NULL,
	erporder int NULL,
	sophiaorder int NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrationDt datetime DEFAULT getdate() NULL,
	integrationAt datetime DEFAULT getdate() NULL,
	CONSTRAINT PK_integracao_pelican_invoices_range PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_invoices_range_erporder ON dbo.integracao_pelican_invoices_range (  erporder ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_invoices_range_sophiaorder ON dbo.integracao_pelican_invoices_range (  sophiaorder ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_order_biled_range (
	id int IDENTITY(1,1) NOT NULL,
	empresaIdERP varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	filialIdERP varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	status varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrationDt datetime DEFAULT getdate() NULL,
	integrationAt datetime DEFAULT getdate() NULL
);
GO

CREATE TABLE integracao_pelican_orders_range (
	id int IDENTITY(1,1) NOT NULL,
	empresaIdERP varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	filialIdERP varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	status varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrationDt datetime DEFAULT getdate() NULL,
	integrationAt datetime DEFAULT getdate() NULL
);
GO

CREATE TABLE integracao_pelican_pedidos (
	id int IDENTITY(1,1) NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	totalPages int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	integrationDate datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_pedidos PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_endQuery ON dbo.integracao_pelican_pedidos (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_integrationDate ON dbo.integracao_pelican_pedidos (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_queryKey ON dbo.integracao_pelican_pedidos (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_pedidos_faturados (
	id int IDENTITY(1,1) NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	totalPages int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	integrationDate datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_pedidos_faturados PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_endQuery ON dbo.integracao_pelican_pedidos_faturados (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_integrationDate ON dbo.integracao_pelican_pedidos_faturados (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_queryKey ON dbo.integracao_pelican_pedidos_faturados (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_pedidos_faturados_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_pedidos_faturados_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_log_actionName ON dbo.integracao_pelican_pedidos_faturados_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_log_insertedAt ON dbo.integracao_pelican_pedidos_faturados_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_log_responseCode ON dbo.integracao_pelican_pedidos_faturados_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_log_status ON dbo.integracao_pelican_pedidos_faturados_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_faturados_log_topic ON dbo.integracao_pelican_pedidos_faturados_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_pedidos_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_pedidos_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_log_actionName ON dbo.integracao_pelican_pedidos_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_log_insertedAt ON dbo.integracao_pelican_pedidos_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_log_responseCode ON dbo.integracao_pelican_pedidos_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_log_status ON dbo.integracao_pelican_pedidos_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_pedidos_log_topic ON dbo.integracao_pelican_pedidos_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_status (
	id int IDENTITY(1,1) NOT NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	totalPages int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	integrationDate datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_status PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_endQuery ON dbo.integracao_pelican_status (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_integrationDate ON dbo.integracao_pelican_status (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_queryKey ON dbo.integracao_pelican_status (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pelican_status_log (
	id int IDENTITY(1,1) NOT NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	actionName varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	topic varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseMessage varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	returnResponse varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pelican_status_log PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_log_actionName ON dbo.integracao_pelican_status_log (  actionName ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_log_insertedAt ON dbo.integracao_pelican_status_log (  insertedAt ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_log_responseCode ON dbo.integracao_pelican_status_log (  responseCode ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_log_status ON dbo.integracao_pelican_status_log (  status ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integracao_pelican_status_log_topic ON dbo.integracao_pelican_status_log (  topic ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_pfs_request (
	id int IDENTITY(1,1) NOT NULL,
	cliente varchar(20) COLLATE Latin1_General_CI_AS NOT NULL,
	JSON ntext COLLATE Latin1_General_CI_AS NULL,
	status varchar(4000) COLLATE Latin1_General_CI_AS NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	num_pedido varchar(30) COLLATE Latin1_General_CI_AS NOT NULL,
	CONSTRAINT integracao_pfs_request_id PRIMARY KEY (id)
);
GO

CREATE TABLE integracao_pfs_stock (
	id int IDENTITY(1,1) NOT NULL,
	codigoEan varchar(20) COLLATE Latin1_General_CI_AS NOT NULL,
	armazen varchar(30) COLLATE Latin1_General_CI_AS NOT NULL,
	JSON ntext COLLATE Latin1_General_CI_AS NOT NULL,
	status varchar(4000) COLLATE Latin1_General_CI_AS DEFAULT 'in integration' NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_integracao_pfs_stock PRIMARY KEY (id)
);
GO

CREATE TABLE log_flow (
	tenantId varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	orderId varchar(8) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	sourceCRM varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	id bigint IDENTITY(1,1) NOT NULL,
	name varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	status varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	description varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[dateTime] datetime NULL,
	CONSTRAINT pk_log_flow PRIMARY KEY (tenantId,orderId,sourceCRM,id)
);
GO

CREATE TABLE log_integration (
	id bigint IDENTITY(1,1) NOT NULL,
	moment datetime NULL,
	logType nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	layer nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	service nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	logInformation nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__log_inte__3213E83FE8FC6D80 PRIMARY KEY (id)
);
GO

CREATE TABLE order_checks (
	tenantId varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	orderId varchar(8) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	sourceCRM varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	checkDescription varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	seq int NULL,
	finalSeq int NULL,
	topicName varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	sent bit DEFAULT 0 NULL,
	success bit NULL,
	retryNumber int DEFAULT 0 NULL,
	nextTry datetime NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	url varchar(2000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[method] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	body varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode int NULL,
	response varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	validations_ok bit DEFAULT 0 NULL,
	CONSTRAINT pk_order_checks PRIMARY KEY (tenantId,orderId,sourceCRM,checkDescription)
);
GO

CREATE TABLE orders (
	tenantId varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	orderId varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	sourceCRM varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	json_order nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	branchId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	orderIdERP varchar(8) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	status varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT pk_orders PRIMARY KEY (tenantId,orderId,sourceCRM)
);
GO

CREATE TABLE orders_log_change (
	id int IDENTITY(1,1) NOT NULL,
	runDate date DEFAULT format(getdate(),'yyyy-MM-dd') NOT NULL,
	runTime varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT format(getdate(),'HH:mm') NOT NULL,
	lastRecno int NULL,
	tenantId varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	branchId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	sourceCRM varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	success bit NULL,
	responseCode int NULL,
	response varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT pk_orders_log_change PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_orders_log_change#runDate ON dbo.orders_log_change (  runDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE orders_status_change (
	id int IDENTITY(1,1) NOT NULL,
	runDate date DEFAULT format(getdate(),'yyyy-MM-dd') NOT NULL,
	runTime varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT format(getdate(),'HH:mm') NOT NULL,
	[range] datetime NULL,
	tenantId varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	branchId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	sourceCRM varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	success bit NULL,
	responseCode int NULL,
	response varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT pk_orders_status_change PRIMARY KEY (id)
);
 CREATE NONCLUSTERED INDEX idx_orders_status_change#runDate ON dbo.orders_status_change (  runDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE token_controller (
	id int IDENTITY(0,1) NOT NULL,
	token varchar(1000) COLLATE Latin1_General_CI_AS NOT NULL,
	tokenSystem varchar(255) COLLATE Latin1_General_CI_AS NOT NULL,
	statusToken int NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NULL,
	lifeTime varchar(1000) COLLATE Latin1_General_CI_AS NULL,
	CONSTRAINT PK_TOKENCONTROLLERGKO_ID PRIMARY KEY (id)
);
ALTER TABLE token_controller WITH NOCHECK ADD CONSTRAINT CK_TOKENCONTROLLERGKO_STATUSTOKEN CHECK ([STATUSTOKEN]=(400) OR [STATUSTOKEN]=(200));
GO

CREATE TABLE transfer_request (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	idTransferRequestArray int NOT NULL,
	tenantId varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	branchId varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	transferRequestId nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	jsonTransferRequest nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	jsonInvoiceTransferRequest nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	statusTransferRequest nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	retry int NULL,
	nextRetry datetime NULL,
	createdAt datetime NULL,
	updatedAt datetime NULL
);
GO

CREATE TABLE transfer_request_array (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	dataInicio datetime NULL,
	dataFim datetime NULL,
	totalRequest int NULL,
	totalPages int NULL,
	currentPage int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime NULL,
	updatedAt datetime NULL,
	integrationDate datetime NULL
);
GO

CREATE TABLE flow_filiais (
	cod_empresa varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_filial varchar(6) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	nome_filial varchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	integrador bit DEFAULT 0 NULL,
	CONSTRAINT pk_flow_filiais PRIMARY KEY (cod_empresa,cod_filial),
	CONSTRAINT fk_flow_filiais#empresas FOREIGN KEY (cod_empresa) REFERENCES flow_empresas(cod_empresa)
);
GO

CREATE TABLE flow_sistemas (
	cod_empresa varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_sistema int NOT NULL,
	nome_sistema varchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	tipo_sistema varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT pk_flow_sistemas PRIMARY KEY (cod_empresa,cod_sistema),
	CONSTRAINT fk_flow_sistemas#empresas FOREIGN KEY (cod_empresa) REFERENCES flow_empresas(cod_empresa)
);
GO

CREATE TABLE inspect_supplier_qualification (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	invoiceId varchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	registerInspectId varchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	jsonInspectSupplierQualification nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	statusInspectSupplierQualification nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	retry int NULL,
	nextRetry datetime NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	logInspectSupplierQualification nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT pk_inspect_supplier_qualification PRIMARY KEY (id),
	CONSTRAINT fk_inspect_supplier_qualification FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
GO

CREATE TABLE integracao_ordens_compra_dados (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	dataInicio datetime NULL,
	dataFim datetime NULL,
	totalOrders int NULL,
	totalPages int NULL,
	currentPage int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	integrationDate datetime NULL,
	CONSTRAINT pk_integracao_ordens_compra_dados PRIMARY KEY (id),
	CONSTRAINT fk_ordens_compra_dados FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
 CREATE NONCLUSTERED INDEX idx_dataFim#integracao_orderns_compra_dados ON dbo.integracao_ordens_compra_dados (  dataFim ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_endQuery#integracao_orderns_compra_dados ON dbo.integracao_ordens_compra_dados (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integrationDate#integracao_orderns_compra_dados ON dbo.integracao_ordens_compra_dados (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_queryKey#integracao_orderns_compra_dados ON dbo.integracao_ordens_compra_dados (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_dados_reg_insp (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NULL,
	buyOrderId int NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	buyOrderData ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	insertedInspRegDate datetime NULL,
	integrationDate datetime NULL,
	deletedDate datetime NULL,
	CONSTRAINT pk_integracao_ordens_compra_dados_reg_insp PRIMARY KEY (id),
	CONSTRAINT fk_integracao_ordens_compra_dados_reg_insp FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
 CREATE NONCLUSTERED INDEX idx_buyOrderId#integracao_ordens_compra_dados_reg_insp ON dbo.integracao_ordens_compra_dados_reg_insp (  buyOrderId ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_deletedDate#integracao_ordens_compra_dados_reg_insp ON dbo.integracao_ordens_compra_dados_reg_insp (  deletedDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_insertedInspRegDate#integracao_ordens_compra_dados_reg_insp ON dbo.integracao_ordens_compra_dados_reg_insp (  insertedInspRegDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integrationDate#integracao_ordens_compra_dados_reg_insp ON dbo.integracao_ordens_compra_dados_reg_insp (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_queryKey#integracao_ordens_compra_dados_reg_insp ON dbo.integracao_ordens_compra_dados_reg_insp (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_etiqueta (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NULL,
	idCliente int NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	statusTagList varchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	dataInicio datetime NULL,
	dataFim datetime NULL,
	totalTags int NULL,
	totalPages int NULL,
	currentPage int NULL,
	[result] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	integrationDate datetime NULL,
	CONSTRAINT pk_integracao_ordens_compra_etiqueta PRIMARY KEY (id),
	CONSTRAINT fk_integracao_ordens_compra_etiqueta FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
 CREATE NONCLUSTERED INDEX idx_dataFim#integracao_ordens_compra_etiqueta ON dbo.integracao_ordens_compra_etiqueta (  dataFim ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_endQuery#integracao_ordens_compra_etiqueta ON dbo.integracao_ordens_compra_etiqueta (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integrationDate#integracao_ordens_compra_etiqueta ON dbo.integracao_ordens_compra_etiqueta (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_queryKey#integracao_ordens_compra_etiqueta ON dbo.integracao_ordens_compra_etiqueta (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_statusTagList#integracao_ordens_compra_etiqueta ON dbo.integracao_ordens_compra_etiqueta (  statusTagList ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE integracao_ordens_compra_etiqueta WITH NOCHECK ADD CONSTRAINT CK__integraca__statu__33DFA290 CHECK ([statusTagList]='ENTRADA ERP REALIZADA' OR [statusTagList]='ERRO INTEGRAÇÃO ERP' OR [statusTagList]='INTEGRADO ERP' OR [statusTagList]='PENDENTE INTEGRAÇÃO ERP');
GO

CREATE TABLE integracao_ordens_compra_materiais (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	totalProducts int NULL,
	totalPages int NULL,
	currentPage int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	integrationDate datetime NULL,
	CONSTRAINT pk_integracao_ordens_compra_materiais PRIMARY KEY (id),
	CONSTRAINT fk_ordens_compra_materiais FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
 CREATE NONCLUSTERED INDEX idx_endQuery#integracao_orderns_compra_materiais ON dbo.integracao_ordens_compra_materiais (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integrationDate#integracao_orderns_compra_materiais ON dbo.integracao_ordens_compra_materiais (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_queryKey#integracao_orderns_compra_materiais ON dbo.integracao_ordens_compra_materiais (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE integracao_ordens_compra_solicitacao (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NULL,
	queryKey varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	commandSent varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	dataInicio datetime NULL,
	dataFim datetime NULL,
	totalRequests int NULL,
	totalPages int NULL,
	currentPage int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	insertedAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	integrationDate datetime NULL,
	CONSTRAINT pk_integracao_ordens_compra_solicitacao PRIMARY KEY (id),
	CONSTRAINT fk_ordens_compra_solicitacao FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
 CREATE NONCLUSTERED INDEX idx_dataFim#integracao_orderns_compra_solicitacao ON dbo.integracao_ordens_compra_solicitacao (  dataFim ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_endQuery#integracao_orderns_compra_solicitacao ON dbo.integracao_ordens_compra_solicitacao (  endQuery ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_integrationDate#integracao_orderns_compra_solicitacao ON dbo.integracao_ordens_compra_solicitacao (  integrationDate ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX idx_queryKey#integracao_orderns_compra_solicitacao ON dbo.integracao_ordens_compra_solicitacao (  queryKey ASC  )
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
GO

CREATE TABLE supplier_qualification (
	id int IDENTITY(1,1) NOT NULL,
	idConfig int NOT NULL,
	responseCode varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	totalQuestions int NULL,
	[result] ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	beginQuery datetime NULL,
	endQuery datetime NULL,
	createdAt datetime DEFAULT getdate() NULL,
	updatedAt datetime NULL,
	integrationDate datetime NULL,
	logSupplierQualification ntext COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT pk_supplier_qualification PRIMARY KEY (id),
	CONSTRAINT fk_supplier_qualification FOREIGN KEY (idConfig) REFERENCES integracao_ordens_compra_config(id)
);
GO

CREATE TABLE flow_de_para_cond_pagto (
	cod_empresa_crm varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_sistema_crm int NOT NULL,
	cod_cond_pagto_crm varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_empresa_erp varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_sistema_erp int NOT NULL,
	cod_cond_pagto_erp varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT pk_flow_de_para_cond_pagto PRIMARY KEY (cod_empresa_crm,cod_sistema_crm,cod_cond_pagto_crm,cod_empresa_erp,cod_sistema_erp),
	CONSTRAINT fk_flow_de_para_cond_pagto#sistemas1 FOREIGN KEY (cod_empresa_crm,cod_sistema_crm) REFERENCES flow_sistemas(cod_empresa,cod_sistema),
	CONSTRAINT fk_flow_de_para_cond_pagto#sistemas2 FOREIGN KEY (cod_empresa_erp,cod_sistema_erp) REFERENCES flow_sistemas(cod_empresa,cod_sistema)
);
GO

CREATE TABLE flow_de_para_filiais (
	cod_empresa_crm varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_sistema_crm int NOT NULL,
	cod_filial_crm varchar(6) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_empresa_erp varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	cod_sistema_erp int NOT NULL,
	cod_filial_erp varchar(6) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT pk_flow_de_para_filiais PRIMARY KEY (cod_empresa_crm,cod_sistema_crm,cod_filial_crm,cod_empresa_erp,cod_sistema_erp),
	CONSTRAINT fk_flow_filiais#sistemas1 FOREIGN KEY (cod_empresa_crm,cod_sistema_crm) REFERENCES flow_sistemas(cod_empresa,cod_sistema),
	CONSTRAINT fk_flow_filiais#sistemas2 FOREIGN KEY (cod_empresa_erp,cod_sistema_erp) REFERENCES flow_sistemas(cod_empresa,cod_sistema)
);
GO

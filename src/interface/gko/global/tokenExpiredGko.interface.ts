class IGetTokenExpiredGkoJSON {
	GKO: {
		Servico: {
			_attributes: {
				status: string;
				tpServico: string;
			};
			Mensagens: {
				Mensagem: {
					_attributes: {
						tipoMensagem: string;
					};
					cdMensagem: {
						_text: string;
					};
					txDsReduzida: {
						_text: string;
					};
					txDsDetalhada: {
						_text: string;
					};
					msgOriginal: {
						_text?: string;
					};
					txCausasSolucoes: {
						_text: string;
					};
					Sigla: {
						_text: string;
					};
					InfoAdicionais: InfoAdicionais[];
				};
			};
		};
	};
}

interface InfoAdicionais {
	InfoAdicional: {
		tpInformacao: {
			_text: string;
		};
		nmParametro: {
			_text: string;
		};
		txLabel: {
			_text: string;
		};
		vrParametro: {
			_text: string;
		};
	};
}

export { IGetTokenExpiredGkoJSON };

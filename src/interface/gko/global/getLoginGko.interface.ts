interface IGetLoginGkoJSON {
	GKO: {
		Servico: {
			_attributes: {
				idsessao: string;
				status: string;
				idProcesso: string;
				idTarefa: string;
				StTermoPersonalizado: string;
			};
			ConfiguracaoSessao: {
				TempoPingSessao: {
					_text: string;
				};
				LimiteSessaoPerdida: {
					_text: string;
				};
				TempoBloqueioSessaoInatividade: {
					_text: string;
				};
				TempoEncerraSessaoInatividade: {
					_text: string;
				};
			};
			sistema: {
				nomefantasia: {
					_text: string;
				};
				versao: {
					_text: string;
				};
				mensagem: {
					_text: string;
				};
			};
			usuario: {
				nome: {};
				login: {
					_text: string;
				};
				NmUsuario: {
					_text: string;
				};
				Email: {};
				database: {
					_text: string;
				};
				Grupos: {
					_text: string;
				};
				stadministrador: {
					_text: string;
				};
			};
		};
		HoraInicial: {
			_text: string;
		};
		HoraFinal: {
			_text: string;
		};
		TempoGasto: {
			_text: string;
		};
	};
}

export { IGetLoginGkoJSON };
